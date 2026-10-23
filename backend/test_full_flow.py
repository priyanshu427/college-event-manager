#!/usr/bin/env python3
"""
Automated End-to-End Test Suite for College Event Manager
Verifies Core Workflows:
1. Health & Database Connectivity (FastAPI & MySQL via SQLAlchemy)
2. Authentication & Strict RBAC (Student vs Organizer permissions)
3. Event Creation & Directory Verification
4. 1-Click Registration & Ticket Generation (Duplicate Prevention)
5. Capacity & Overbooking Enforcement
6. QR Attendance & Check-in Verification (RBAC & Duplicate Scan detection)
7. Event Cleanup & Cascading Registration Removal
"""

import os
import sys
import time
from typing import Dict, Any, Tuple

try:
    import requests
except ImportError:
    import httpx
    # Lightweight requests-compatible adapter for httpx if requests isn't present
    class RequestsAdapter:
        @staticmethod
        def get(url, **kwargs):
            return httpx.get(url, **kwargs)
        @staticmethod
        def post(url, **kwargs):
            return httpx.post(url, **kwargs)
        @staticmethod
        def delete(url, **kwargs):
            return httpx.delete(url, **kwargs)
    requests = RequestsAdapter

# Terminal ANSI Color Codes
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")


class FlowTestRunner:
    __test__ = False

    def __init__(self):
        self.results = []
        self.start_time = time.time()

    def record(self, step_id: str, title: str, passed: bool, message: str = ""):
        self.results.append({
            "step_id": step_id,
            "title": title,
            "passed": passed,
            "message": message,
        })
        status_tag = f"{GREEN}{BOLD}[PASS]{RESET}" if passed else f"{RED}{BOLD}[FAIL]{RESET}"
        print(f"  {status_tag} {BOLD}{step_id}:{RESET} {title}")
        if message:
            print(f"         {CYAN}-> {message}{RESET}")

    def summary(self) -> bool:
        elapsed = time.time() - self.start_time
        total = len(self.results)
        passed = sum(1 for r in self.results if r["passed"])
        failed = total - passed

        print("\n" + "=" * 65)
        print(f"{BOLD}                TEST EXECUTION SUMMARY{RESET}")
        print("=" * 65)
        print(f" Total Test Cases : {total}")
        print(f" Passed           : {GREEN}{passed}{RESET}")
        print(f" Failed           : {RED if failed else GREEN}{failed}{RESET}")
        print(f" Total Duration   : {elapsed:.2f}s")
        print("=" * 65)

        if failed == 0:
            print(f"{GREEN}{BOLD}🎉 ALL CORE WORKFLOW TESTS PASSED SUCCESSFULLY!{RESET}\n")
            return True
        else:
            print(f"{RED}{BOLD}❌ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.{RESET}\n")
            return False


def test_full_flow():
    runner = FlowTestRunner()

    print(f"\n{BOLD}{CYAN}================================================================={RESET}")
    print(f"{BOLD}{CYAN}       COLLEGE EVENT MANAGER — AUTOMATED FULL-FLOW TEST SUITE    {RESET}")
    print(f"{BOLD}{CYAN}================================================================={RESET}")
    print(f"Target Backend: {BASE_URL}")

    # ---------------------------------------------------------
    # 1. Health & Database Connectivity
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 1] Health & Connectivity Checks{RESET}")
    try:
        docs_res = requests.get(f"{BASE_URL}/docs", timeout=5)
        runner.record(
            "1.1",
            "FastAPI backend /docs endpoint responds HTTP 200 OK",
            docs_res.status_code == 200,
            f"Status: {docs_res.status_code}",
        )
    except Exception as e:
        runner.record("1.1", "FastAPI backend /docs endpoint responds HTTP 200 OK", False, str(e))

    try:
        # Verify SQLAlchemy MySQL engine connection directly
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from backend.database import SessionLocal, engine
        from backend import models
        from sqlalchemy import text

        db = SessionLocal()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        event_count = db.query(models.Event).count()
        user_count = db.query(models.User).count()
        db.close()

        runner.record(
            "1.2",
            "MySQL database connection active via SQLAlchemy",
            True,
            f"Successfully queried tables ({event_count} events, {user_count} users)",
        )
    except Exception as e:
        runner.record("1.2", "MySQL database connection active via SQLAlchemy", False, str(e))

    # Pre-test cleanup: ensure no leftover test events from previous aborted runs
    try:
        db = SessionLocal()
        leftovers = db.query(models.Event).filter(models.Event.title == "Automated Test Hackathon").all()
        for ev in leftovers:
            db.query(models.Registration).filter(models.Registration.event_id == ev.id).delete()
            db.delete(ev)
        db.commit()
        db.close()
    except Exception:
        pass

    # ---------------------------------------------------------
    # 2. Authentication & Strict RBAC
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 2] Authentication & RBAC Verification{RESET}")
    student_token = None
    organizer_token = None

    # 2.1 Student Login
    try:
        student_payload = {
            "identifier": "aarav.menon@sit.edu.in",
            "password": "student123",
            "role": "student"
        }
        res = requests.post(f"{BASE_URL}/api/auth/login", json=student_payload, timeout=5)
        data = res.json() if res.status_code == 200 else {}
        student_token = data.get("token")
        user_role = data.get("user", {}).get("role")
        runner.record(
            "2.1",
            "Login as Student ('aarav.menon@sit.edu.in')",
            res.status_code == 200 and bool(student_token) and user_role == "student",
            f"Token generated, role: '{user_role}'",
        )
    except Exception as e:
        runner.record("2.1", "Login as Student ('aarav.menon@sit.edu.in')", False, str(e))

    # 2.2 Student RBAC Denial on Organizer Action (Creating Event)
    try:
        headers_student = {"Authorization": f"Bearer {student_token}"}
        unauthorized_post = requests.post(
            f"{BASE_URL}/api/events",
            json={"title": "Illegal Student Fest", "capacity": 50},
            headers=headers_student,
            timeout=5
        )
        runner.record(
            "2.2",
            "Student token blocked from creating event (403 Forbidden)",
            unauthorized_post.status_code == 403,
            f"Received expected HTTP {unauthorized_post.status_code}",
        )
    except Exception as e:
        runner.record("2.2", "Student token blocked from creating event (403 Forbidden)", False, str(e))

    # 2.3 Organizer Login
    try:
        organizer_payload = {
            "identifier": "meera.organizer@sit.edu.in",
            "password": "organizer123",
            "role": "organizer"
        }
        res = requests.post(f"{BASE_URL}/api/auth/login", json=organizer_payload, timeout=5)
        data = res.json() if res.status_code == 200 else {}
        organizer_token = data.get("token")
        org_role = data.get("user", {}).get("role")
        runner.record(
            "2.3",
            "Login as Organizer ('meera.organizer@sit.edu.in')",
            res.status_code == 200 and bool(organizer_token) and org_role in ["organizer", "admin"],
            f"Organizer token generated, role: '{org_role}'",
        )
    except Exception as e:
        runner.record("2.3", "Login as Organizer ('meera.organizer@sit.edu.in')", False, str(e))

    # ---------------------------------------------------------
    # 3. Event Creation & Verification
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 3] Event Creation & Verification{RESET}")
    created_event_id = None
    try:
        headers_org = {"Authorization": f"Bearer {organizer_token}"}
        create_payload = {
            "title": "Automated Test Hackathon",
            "tagline": "48hr Innovation Sprint",
            "category": "Technical",
            "date": "2026-11-20",
            "startTime": "09:00",
            "endTime": "18:00",
            "venue": "Test Innovation Lab B",
            "department": "Computer Science",
            "capacity": 2,
            "max_capacity": 2,
            "fee": 0,
            "description": "Automated test hackathon event with strictly enforced capacity of 2.",
        }
        create_res = requests.post(f"{BASE_URL}/api/events", json=create_payload, headers=headers_org, timeout=5)
        if create_res.status_code in [200, 201]:
            ev_data = create_res.json()
            created_event_id = ev_data.get("id")
        
        runner.record(
            "3.1",
            "Organizer creates test event ('Automated Test Hackathon', max_capacity = 2)",
            create_res.status_code in [200, 201] and bool(created_event_id),
            f"Created Event ID: {created_event_id}",
        )
    except Exception as e:
        runner.record("3.1", "Organizer creates test event", False, str(e))

    try:
        get_res = requests.get(f"{BASE_URL}/api/events/{created_event_id}", timeout=5)
        event_match = False
        if get_res.status_code == 200:
            ev_json = get_res.json()
            event_match = (
                ev_json.get("title") == "Automated Test Hackathon"
                and ev_json.get("capacity") == 2
            )
        runner.record(
            "3.2",
            "Verify created event is retrievable via GET /api/events/{id}",
            event_match,
            f"Title: '{ev_json.get('title')}', Capacity: {ev_json.get('capacity')}",
        )
    except Exception as e:
        runner.record("3.2", "Verify created event is retrievable", False, str(e))

    # ---------------------------------------------------------
    # 4. 1-Click Registration & Ticket Generation
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 4] 1-Click Registration & Ticket Generation{RESET}")
    student_ticket_1 = None
    try:
        headers_student = {"Authorization": f"Bearer {student_token}"}
        reg_res = requests.post(
            f"{BASE_URL}/api/events/{created_event_id}/register",
            headers=headers_student,
            timeout=5
        )
        if reg_res.status_code in [200, 201]:
            reg_json = reg_res.json()
            student_ticket_1 = reg_json.get("ticket_id")

        runner.record(
            "4.1",
            "Student 1 completes 1-Click Registration (receives unique ticket_id)",
            reg_res.status_code in [200, 201] and bool(student_ticket_1),
            f"Issued Ticket ID: {student_ticket_1}",
        )
    except Exception as e:
        runner.record("4.1", "Student 1 completes 1-Click Registration", False, str(e))

    try:
        # Attempt to register the SAME student a second time
        dup_reg_res = requests.post(
            f"{BASE_URL}/api/events/{created_event_id}/register",
            headers=headers_student,
            timeout=5
        )
        is_conflict = dup_reg_res.status_code in [400, 409]
        runner.record(
            "4.2",
            "Duplicate registration attempt by SAME student rejected with conflict (409/400)",
            is_conflict,
            f"Received expected status HTTP {dup_reg_res.status_code}",
        )
    except Exception as e:
        runner.record("4.2", "Duplicate registration attempt rejected", False, str(e))

    # ---------------------------------------------------------
    # 5. Capacity / Overbooking Check
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 5] Capacity & Overbooking Checks{RESET}")
    student2_token = None
    try:
        # Student 2 logs in and registers (fills 2/2 capacity)
        login2_res = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"identifier": "diya.patel@sit.edu.in", "role": "student"},
            timeout=5
        )
        student2_token = login2_res.json().get("token")
        reg2_res = requests.post(
            f"{BASE_URL}/api/events/{created_event_id}/register",
            headers={"Authorization": f"Bearer {student2_token}"},
            timeout=5
        )
        reg2_ticket = reg2_res.json().get("ticket_id") if reg2_res.status_code in [200, 201] else None

        runner.record(
            "5.1",
            "Student 2 registers successfully to reach max capacity (2/2 slots filled)",
            reg2_res.status_code in [200, 201] and bool(reg2_ticket),
            f"Second Ticket ID: {reg2_ticket} (Event is now at 2/2)",
        )
    except Exception as e:
        runner.record("5.1", "Student 2 registers to fill capacity", False, str(e))

    try:
        # Student 3 logs in and attempts to register (should be blocked by capacity limit)
        login3_res = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"identifier": "priya.nair@sit.edu.in", "role": "student"},
            timeout=5
        )
        student3_token = login3_res.json().get("token")
        reg3_res = requests.post(
            f"{BASE_URL}/api/events/{created_event_id}/register",
            headers={"Authorization": f"Bearer {student3_token}"},
            timeout=5
        )
        is_capacity_error = reg3_res.status_code in [400, 409] and "capacity" in reg3_res.text.lower()
        runner.record(
            "5.2",
            "Student 3 overbooking rejected with capacity limit error (HTTP 400)",
            is_capacity_error,
            f"Received HTTP {reg3_res.status_code}: {reg3_res.json().get('detail', '')}",
        )
    except Exception as e:
        runner.record("5.2", "Student 3 overbooking rejected", False, str(e))

    # ---------------------------------------------------------
    # 6. QR Attendance & Check-in Verification
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 6] QR Attendance Verification & Roster Sync{RESET}")
    try:
        # 6.1 Student token attempts to verify ticket (must be 403 Forbidden)
        verify_student_res = requests.post(
            f"{BASE_URL}/api/attendance/verify",
            json={"ticket_id": student_ticket_1},
            headers={"Authorization": f"Bearer {student_token}"},
            timeout=5
        )
        runner.record(
            "6.1",
            "Unauthorized student scanner blocked from verifying attendance (403 Forbidden)",
            verify_student_res.status_code == 403,
            f"Received expected HTTP {verify_student_res.status_code}",
        )
    except Exception as e:
        runner.record("6.1", "Student scanner blocked", False, str(e))

    try:
        # 6.2 Organizer token verifies ticket 1
        headers_org = {"Authorization": f"Bearer {organizer_token}"}
        verify_org_res = requests.post(
            f"{BASE_URL}/api/attendance/verify",
            json={"ticket_id": student_ticket_1},
            headers=headers_org,
            timeout=5
        )
        v_data = verify_org_res.json() if verify_org_res.status_code == 200 else {}
        is_success = (
            verify_org_res.status_code == 200
            and v_data.get("status") == "success"
            and v_data.get("already_verified") is False
        )
        runner.record(
            "6.2",
            "Organizer verifies Student 1 ticket_id successfully (HTTP 200)",
            is_success,
            f"Message: '{v_data.get('message')}', Verified: True",
        )
    except Exception as e:
        runner.record("6.2", "Organizer verifies Student 1 ticket", False, str(e))

    try:
        # 6.3 Rescan same ticket (must return already verified duplicate response)
        verify_dup_res = requests.post(
            f"{BASE_URL}/api/attendance/verify",
            json={"ticket_id": student_ticket_1},
            headers=headers_org,
            timeout=5
        )
        dup_data = verify_dup_res.json() if verify_dup_res.status_code == 200 else {}
        is_already_verified = (
            verify_dup_res.status_code == 200
            and (dup_data.get("already_verified") is True or "already" in dup_data.get("message", "").lower())
        )
        runner.record(
            "6.3",
            "Rescan of already verified ticket returns duplicate 'Already Checked-In' status",
            is_already_verified,
            f"Status: '{dup_data.get('status')}', Message: '{dup_data.get('message')}'",
        )
    except Exception as e:
        runner.record("6.3", "Rescan duplicate attendance detection", False, str(e))

    try:
        # 6.4 Check participant roster
        roster_res = requests.get(
            f"{BASE_URL}/api/organizer/events/{created_event_id}/roster",
            headers=headers_org,
            timeout=5
        )
        student1_verified = False
        if roster_res.status_code == 200:
            roster_items = roster_res.json()
            for item in roster_items:
                if item.get("ticket_id") == student_ticket_1 and item.get("attendance_verified") is True:
                    student1_verified = True
                    break

        runner.record(
            "6.4",
            "Event roster shows Student 1 attendance_verified == True",
            student1_verified,
            f"Found verified record matching ticket {student_ticket_1} in live roster",
        )
    except Exception as e:
        runner.record("6.4", "Participant roster status check", False, str(e))

    # ---------------------------------------------------------
    # 7. Dynamic Certificate Generation & Close Event Flow
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 7] Dynamic Certificate Generation & Event Closing{RESET}")
    issued_cert_id = None
    try:
        # 7.1 Check certificates before event close (must be 0 for this event)
        headers_student = {"Authorization": f"Bearer {student_token}"}
        certs_before_res = requests.get(f"{BASE_URL}/api/certificates/me", headers=headers_student, timeout=5)
        certs_before = certs_before_res.json() if certs_before_res.status_code == 200 else []
        prior_cert = any(c.get("event_id") == created_event_id for c in certs_before)
        runner.record(
            "7.1",
            "Certificates unissued before event is closed (0 certificates for open event)",
            certs_before_res.status_code == 200 and not prior_cert,
            "Confirmed no certificate issued prematurely",
        )
    except Exception as e:
        runner.record("7.1", "Certificate pre-close verification", False, str(e))

    try:
        # 7.2 Organizer closes event & assigns 1st place to Student 1
        headers_org = {"Authorization": f"Bearer {organizer_token}"}
        close_payload = {
            "first_place_ticket_id": student_ticket_1,
            "second_place_ticket_id": None,
            "third_place_ticket_id": None,
        }
        close_res = requests.post(
            f"{BASE_URL}/api/organizer/events/{created_event_id}/close",
            json=close_payload,
            headers=headers_org,
            timeout=5
        )
        c_data = close_res.json() if close_res.status_code == 200 else {}
        runner.record(
            "7.2",
            "Organizer closes event & triggers certificate issuance with 1st place podium",
            close_res.status_code == 200 and c_data.get("certificates_issued", 0) >= 1,
            f"Status: '{c_data.get('event_status')}', Certificates Issued: {c_data.get('certificates_issued')}",
        )
    except Exception as e:
        runner.record("7.2", "Close event and issue certificates", False, str(e))

    try:
        # 7.3 Student fetches earned certificates via GET /api/certificates/me
        certs_after_res = requests.get(f"{BASE_URL}/api/certificates/me", headers=headers_student, timeout=5)
        earned_cert = None
        if certs_after_res.status_code == 200:
            for c in certs_after_res.json():
                if c.get("event_id") == created_event_id:
                    earned_cert = c
                    issued_cert_id = c.get("certificate_id")
                    break

        cert_valid = (
            earned_cert is not None
            and earned_cert.get("award_rank") == "1st Place"
            and str(issued_cert_id).startswith("CERT-")
        )
        runner.record(
            "7.3",
            "Student retrieves earned dynamic certificate with '1st Place' award rank",
            cert_valid,
            f"Certificate ID: {issued_cert_id}, Award Rank: '{earned_cert.get('award_rank') if earned_cert else None}'",
        )
    except Exception as e:
        runner.record("7.3", "Retrieve earned certificates via GET /api/certificates/me", False, str(e))

    # ---------------------------------------------------------
    # 8. Cleanup
    # ---------------------------------------------------------
    print(f"\n{BOLD}{BLUE}[Phase 8] Cleanup & Cascading Deletion{RESET}")
    if created_event_id:
        try:
            del_res = requests.delete(
                f"{BASE_URL}/api/events/{created_event_id}",
                headers={"Authorization": f"Bearer {organizer_token}"},
                timeout=5
            )
            check_del = requests.get(f"{BASE_URL}/api/events/{created_event_id}", timeout=5)
            cleaned_up = del_res.status_code == 204 and check_del.status_code == 404
            runner.record(
                "8.1",
                "Organizer deletes test event and associated records cascade successfully",
                cleaned_up,
                f"Delete HTTP {del_res.status_code}, Verification GET HTTP {check_del.status_code} (Not Found)",
            )
        except Exception as e:
            runner.record("8.1", "Cleanup of test event", False, str(e))

    success = runner.summary()
    assert success is True, "One or more end-to-end flow tests failed"


if __name__ == "__main__":
    try:
        test_full_flow()
        sys.exit(0)
    except AssertionError:
        sys.exit(1)

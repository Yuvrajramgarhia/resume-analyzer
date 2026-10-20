# Security Specification

## 1. Data Invariants
- `users`: User document ID must equal their authentication UID. The `role` cannot be modified after creation to prevent privilege escalation.
- `resumes`: A resume must belong to the user (`userId` == `request.auth.uid`). A candidate can only read and write their own resumes. A recruiter can read all resumes (but cannot modify candidate resumes).

## 2. Dirty Dozen Payloads
1. Create user with invalid UID.
2. Create user modifying another user's profile.
3. User attempting to escalate role to "recruiter" on update.
4. User writing resume lacking `userId`.
5. User updating resume but changing its `userId`.
6. Missing required keys on create.
7. Extra ghost keys on create or update.
8. Incorrect types for fields.
9. Oversized payloads for strings (e.g., massive fileNames).
10. Modifying immutable timestamps.
11. Reading another candidate's resume as a candidate.
12. Invalid document ID formatting.

## 3. Test Runner
Will be handled via `firestore.rules.test.ts`.

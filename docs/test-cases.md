# To-Do App QA Test Cases

## Test setup

- Use an active, registered user account and a separate account when checking task ownership.
- Start with a known task list; clear test data between cases where noted.
- For login failure cases, remain signed out. For task cases, log in as the test user.
- Actual Result is intentionally unfilled until a test is executed. All cases start as **Not Run**.

| Test ID | Feature | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| AUTH-001 | User Login — valid credentials | 1. Open the login page.<br>2. Enter the registered account's valid email and password.<br>3. Select **Log in**. | Login succeeds and the user is routed to their task dashboard. | — | Not Run |
| AUTH-002 | User Login — incorrect password | 1. Open the login page.<br>2. Enter a registered email and an incorrect password.<br>3. Select **Log in**. | Login is rejected; an error is shown and the user remains signed out. | — | Not Run |
| AUTH-003 | User Login — unknown email | 1. Open the login page.<br>2. Enter an unregistered email and any password.<br>3. Select **Log in**. | Login is rejected with a clear error; no authenticated session is created. | — | Not Run |
| AUTH-004 | User Login — empty fields | 1. Open the login page.<br>2. Leave email and password blank.<br>3. Check the **Log in** button and attempt submission. | Required-field validation prevents submission; no session is created. | — | Not Run |
| AUTH-005 | User Login — malformed email | 1. Open the login page.<br>2. Enter an invalid email format and any password.<br>3. Check the **Log in** button and attempt submission. | Email validation prevents submission; no session is created. | — | Not Run |
| AUTH-006 | User Login — disabled account | 1. Ensure the test account is disabled.<br>2. Enter its correct email and password.<br>3. Select **Log in**. | Login is rejected with an account-disabled message; the user remains signed out. | — | Not Run |
| AUTH-007 | User Login — session after refresh | 1. Log in successfully.<br>2. Refresh the dashboard page. | The authenticated session remains active and the dashboard is still accessible. | — | Not Run |
| TASK-001 | Add Task — title only | 1. Log in and open the task dashboard.<br>2. Enter a valid title; leave optional details blank.<br>3. Select **Add task**. | A new pending task with the entered title appears in the list. | — | Not Run |
| TASK-002 | Add Task — title and details | 1. Enter a valid title and details.<br>2. Select **Add task**. | The new task appears with both title and details and has pending status. | — | Not Run |
| TASK-003 | Add Task — empty title | 1. Leave the title blank.<br>2. Enter optional details.<br>3. Check the **Add task** button and attempt submission. | Submission is prevented and no task is created. | — | Not Run |
| TASK-004 | Add Task — whitespace-only title | 1. Enter only spaces in the title.<br>2. Select **Add task**. | Whitespace-only input is rejected with validation feedback; no task is created. | — | Not Run |
| TASK-005 | Add Task — maximum title length | 1. Enter a title of exactly 80 characters.<br>2. Select **Add task**. | The title is accepted and the task is created. | — | Not Run |
| TASK-006 | Add Task — title exceeds maximum | 1. Enter a title of 81 characters.<br>2. Check the **Add task** button and attempt submission. | Validation prevents submission and indicates the 80-character maximum; no task is created. | — | Not Run |
| TASK-007 | Add Task — form reset | 1. Add a task with a title and details.<br>2. Inspect the add form. | The task is created and the add form is cleared for another entry. | — | Not Run |
| VIEW-001 | View Tasks — all tasks | 1. Ensure the user has pending and completed tasks.<br>2. Select the **All** filter. | All tasks owned by the signed-in user are displayed, regardless of status. | — | Not Run |
| VIEW-002 | View/Filter Tasks — pending | 1. Ensure the user has pending and completed tasks.<br>2. Select the **Pending** filter. | Only pending tasks owned by the signed-in user are displayed. | — | Not Run |
| VIEW-003 | View/Filter Tasks — completed | 1. Ensure the user has pending and completed tasks.<br>2. Select the **Completed** filter. | Only completed tasks owned by the signed-in user are displayed. | — | Not Run |
| VIEW-004 | View Tasks — empty list | 1. Ensure the signed-in user has no tasks.<br>2. Select the **All** filter. | A clear empty-state message is shown; the list contains no task entries. | — | Not Run |
| VIEW-005 | View/Filter Tasks — no matching tasks | 1. Ensure the user has no tasks in one status (for example, completed).<br>2. Select that status filter. | A status-specific empty-state message is shown; nonmatching tasks are not displayed. | — | Not Run |
| VIEW-006 | View Tasks — task ownership | 1. Create tasks as User A.<br>2. Sign in as User B and open the dashboard. | User B cannot see User A's tasks. | — | Not Run |
| VIEW-007 | View Tasks — toggle status | 1. Locate a pending task and mark it complete.<br>2. Select **Completed**, then toggle it back to pending. | The task status and completion styling update each time, and the task appears in the corresponding filter. | — | Not Run |
| EDIT-001 | Edit Task — update title and details | 1. Select **Edit** on an existing task.<br>2. Change its title and details.<br>3. Select **Save changes**. | The existing task is updated with the new values; no duplicate task is created. | — | Not Run |
| EDIT-002 | Edit Task — empty title | 1. Select **Edit** on a task.<br>2. Clear the title.<br>3. Check **Save changes** and attempt submission. | Saving is prevented with validation feedback; the existing task remains unchanged. | — | Not Run |
| EDIT-003 | Edit Task — title exceeds maximum | 1. Select **Edit** on a task.<br>2. Enter a title of 81 characters.<br>3. Check **Save changes** and attempt submission. | Saving is prevented; the existing task remains unchanged and validation indicates the maximum length. | — | Not Run |
| EDIT-004 | Edit Task — cancel changes | 1. Select **Edit** on a task and change its fields.<br>2. Select **Cancel**. | Edit mode closes and the task retains its original values. | — | Not Run |
| EDIT-005 | Edit Task — preserve status | 1. Mark a task completed.<br>2. Edit and save its title or details.<br>3. Inspect the task status and completed filter. | The edited values are saved and the task remains completed. | — | Not Run |
| DEL-001 | Delete Task — confirm | 1. Select **Delete** on a task.<br>2. Confirm the deletion prompt. | The selected task is removed and no longer appears in any filter. | — | Not Run |
| DEL-002 | Delete Task — cancel | 1. Select **Delete** on a task.<br>2. Cancel or dismiss the confirmation prompt. | The task remains unchanged in the list. | — | Not Run |
| DEL-003 | Delete Task — only selected task | 1. Ensure at least two tasks exist.<br>2. Delete one task and confirm.<br>3. Inspect the remaining list. | Only the selected task is removed; all other tasks remain. | — | Not Run |
| EDGE-001 | Empty/Invalid Input — optional details | 1. Enter a valid title and leave details empty.<br>2. Submit the task. | The task is created successfully with no details displayed. | — | Not Run |
| EDGE-002 | Empty/Invalid Input — title boundary during edit | 1. Edit a task and enter a title of exactly 80 characters.<br>2. Save the changes. | The update is accepted and the full title is retained. | — | Not Run |
| EDGE-003 | Empty/Invalid Input — no accidental mutation | 1. Submit the add form with an empty title.<br>2. Attempt to save an edit with an empty title.<br>3. Inspect the task list. | Neither operation adds, removes, nor changes a task. | — | Not Run |
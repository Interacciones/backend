## Admin: Entrepreneurship moderation

This document lists the admin endpoints and data structures to manage entrepreneurship projects and their comments.

### Data for moderation

- Reports on Projects: `ReportOfEntrepreneurProject`
  - Fields: `id`, `userId` (reporter), `projectId`, `description`, `status` ('pending' lifecycle)

- Reports on Comments: `ReportOfEntrepreneurComment`
  - Fields: `id`, `userId` (reporter), `commentId`, `description`, `status` ('pending' lifecycle)

- Report History
  - Project history: `ReportHistoryOfEntrepreneurProjects`
  - Comment history: `ReportHistoryOfEntrepreneurComments`
  - Common fields: `reportedByUserId`, `createdByUserId` (author of content), `handlerAdminUserId` (admin who decided), `status` (decision), `decisionArgument`

### Admin endpoints

Unaccepted projects (approval queue)

- GET `/unaccepted-projects` — list projects pending approval (`isActive=false`)
  - Response 200:
    ```json
    {
      "message": "Projects fetched successfully",
      "data": [
        { "id": 123, "name": "Project name", "userId": 77, "isActive": false }
      ]
    }
    ```

- PATCH `/projects/accept/:id` — accept project (sets `isActive=true`)
  - Path params: `id` (number, project ID)
  - Body: `{}`
  - Response 200:
    ```json
    { "message": "Project accepted successfully" }
    ```

- DELETE `/projects/reject/:id` — reject project (deletes it)
  - Path params: `id` (number, project ID)
  - Body: `{}`
  - Response 200:
    ```json
    { "message": "Project rejected successfully" }
    ```

- GET `/reports/project` — list pending project reports
  - Includes reporting user data and project data (and owner user)

- GET `/reports/project-comment` — list pending comment reports
  - Includes reporting user, comment content with author, and project summary

- PATCH `/reports/project/eliminate` — eliminate a project by report
  - Body: `{ reportedByUserId, createdByUserId, reportId, decisionArgument }`
  - Effect: stores decision in `ReportHistoryOfEntrepreneurProjects`, deletes the project (and photos), deletes the report

- PATCH `/reports/project/ignore` — ignore a project report
  - Body: `{ reportedByUserId, createdByUserId, reportId, decisionArgument }`
  - Effect: stores decision in `ReportHistoryOfEntrepreneurProjects`, deletes the report

- PATCH `/reports/project-comment/eliminate` — eliminate a comment by report
  - Body: `{ reportedByUserId, createdByUserId, reportId, decisionArgument }`
  - Effect: stores decision in `ReportHistoryOfEntrepreneurComments`, deletes the comment, deletes the report

- PATCH `/reports/project-comment/ignore` — ignore a comment report
  - Body: `{ reportedByUserId, createdByUserId, reportId, decisionArgument }`
  - Effect: stores decision in `ReportHistoryOfEntrepreneurComments`, deletes the report

### Status lifecycle

- New user reports are created with `status: 'pending'`.
- On admin action, a historical record is saved with a human-readable `status` decision text and a `decisionArgument`.

### Notes

- All admin endpoints require admin authentication (same as other admin routes).
- Eliminating a project removes associated photos.
- You can extend to send notification emails, mirroring tutor/review flows.





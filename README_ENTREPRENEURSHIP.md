## Entrepreneurship feature additions

This document summarizes new models, migrations, endpoints, and behavior for Entrepreneurship Projects and their comments/reports to share with the frontend team.

### Data models

- Entrepreneur Projects (`EntrepreuneurProject`)
  - Fields: `userId`, `name`, `description` (max 2000), `instagramProfile`, `showContact` (boolean), `isActive` (boolean)
  - Associations:
    - `belongsTo User`
    - `hasMany EntrepreneurProjectPhoto`
    - `hasMany EntrepreneurProjectComment`
    - `hasMany ReportOfEntrepreneurProject`

- Photos (`EntrepreneurProjectPhoto`)
  - Fields: `projectId`, `photo` (URL)
  - Association: `belongsTo EntrepreuneurProject`

- Comments (`EntrepreneurProjectComment`)
  - Fields: `userId`, `projectId`, `parentCommentId` (nullable), `content` (max 1000)
  - Associations:
    - `belongsTo User`
    - `belongsTo EntrepreuneurProject`
    - Self-referencing tree: `belongsTo parent`, `hasMany replies`
    - `hasMany ReportOfEntrepreneurComment`

- Reports on Projects (`ReportOfEntrepreneurProject`)
  - Fields: `userId`, `projectId`, `description`, `status`
  - Associations: `belongsTo User`, `belongsTo EntrepreuneurProject`

- Reports on Comments (`ReportOfEntrepreneurComment`)
  - Fields: `userId`, `commentId`, `description`, `status`
  - Associations: `belongsTo User`, `belongsTo EntrepreneurProjectComment`

### Migrations

Added migrations:
- `20250514000000-create-entrepreneur-project-comment.js`
- `20250514000001-create-report-of-entrepreneur-project.js`
- `20250514000002-create-report-of-entrepreneur-comment.js`

Existing migrations for projects and photos:
- `20250513220711-create-entrepreneur-project.js`
- `20250513220712-create-entrepreneur-project-photo.js`

### API endpoints

Unprotected:
- GET `/projects` — list active projects
- GET `/projects/:id` — get active project; if `showContact` is true returns owner contact data
- GET `/projects/:projectId/comments` — fetch comment thread (nested `replies` array per comment)

User-protected:
- POST `/projects` — create project
  - Body: `name`, `description`, `instagramProfile?`, `showContact?` (bool/string)
  - Files: `photo0..photo4` (or array `photos`); 1–5 photos required; uploaded to S3
  - Result: project is created with `isActive=false` (pending admin approval)
- PATCH `/projects/:id` — update own project
  - Body: any of `name`, `description`, `instagramProfile`, `showContact`, `photosToKeep` (comma-separated photo IDs)
  - Files: new photos (0–5 total after merges). Project resets to `isActive=false`
- DELETE `/projects/:id` — delete own project (and its photos)
- GET `/projects-self` — fetch own project
- POST `/projects/:projectId/comments` — create comment or reply
  - Body: `projectId` (redundant with path, accepted), `parentCommentId?`, `content`
- POST `/reports/project` — report a project
  - Body: `projectId`, `description`
- POST `/reports/project-comment` — report a comment
  - Body: `commentId`, `description`

Admin-protected (existing):
- GET `/unaccepted-projects` — list pending projects
- PATCH `/projects/accept/:id` — accept a project (`isActive=true`)
- DELETE `/projects/reject/:id` — reject a project

### Notes for frontend

- Photo upload: send files as `photo0..photo4` (ordered) or as `photos[]`. Maximum 5.
- Comment threading: comments are returned flattened to a tree with a `replies` array; to reply, set `parentCommentId` when creating a comment.
- Contact visibility: project endpoint returns `user` data only when `showContact` is true.
- After project creation/update, `isActive=false` until admin approves; hide from public lists until approved.





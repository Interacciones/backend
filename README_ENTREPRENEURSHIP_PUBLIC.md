## Entrepreneurship API (Public + User)

This document lists endpoints for entrepreneurship projects that do NOT require admin access. It includes public endpoints and endpoints that require an authenticated user.

Auth conventions
- Public endpoints: no auth needed
- User endpoints: Authorization: Bearer <userToken>
- Content types: `application/json` unless specified (multipart for photos)

Photo upload rules
- Send files as `photo0..photo4` (ordered) OR as `photos[]`
- Minimum 1 photo on create
- Maximum 5 photos total (create and update)

### Public endpoints

- GET `/projects` — list active projects
  - Response 200:
    ```json
    {
      "message": "Projects fetched successfully",
      "data": [
        {
          "id": 1,
          "name": "Project name",
          "description": "Up to 2000 chars",
          "instagramProfile": "my_ig",
          "photos": [
            "https://.../photo-1.jpg",
            "https://.../photo-2.jpg"
          ]
        }
      ]
    }
    ```

- GET `/projects/:id` — get one active project
  - Returns owner contact info only when `showContact=true`
  - Response 200 (no contact):
    ```json
    {
      "message": "Project fetched successfully",
      "data": {
        "id": 1,
        "name": "Project name",
        "description": "...",
        "instagramProfile": "my_ig",
        "photos": ["https://.../photo-1.jpg"]
      }
    }
    ```
  - Response 200 (with contact):
    ```json
    {
      "message": "Project fetched successfully",
      "data": {
        "id": 1,
        "name": "Project name",
        "description": "...",
        "instagramProfile": "my_ig",
        "photos": ["https://.../photo-1.jpg"],
        "user": { "name": "John", "lastName": "Doe", "email": "john@example.com" }
      }
    }
    ```

- GET `/projects/:projectId/comments` — nested comment thread
  - Response 200:
    ```json
    {
      "message": "Comments fetched successfully",
      "data": [
        {
          "id": 10,
          "userId": 3,
          "projectId": 1,
          "content": "Parent comment",
          "parentCommentId": null,
          "User": { "id": 3, "name": "Alice", "lastName": "Smith" },
          "replies": [
            {
              "id": 11,
              "userId": 4,
              "projectId": 1,
              "content": "Reply",
              "parentCommentId": 10,
              "User": { "id": 4, "name": "Bob", "lastName": "Brown" },
              "replies": []
            }
          ]
        }
      ]
    }
    ```

### User-protected endpoints

- POST `/projects` — create project (multipart/form-data)
  - Body fields: `name` (string, required), `description` (string, required), `instagramProfile?` (string), `showContact?` (boolean or 'true'/'false')
  - Files: `photo0..photo4` or `photos[]`; at least 1; at most 5
  - Response 201:
    ```json
    {
      "message": "Project created successfully and pending admin approval",
      "data": {
        "id": 123,
        "name": "My project",
        "description": "Up to 2000 chars",
        "instagramProfile": "my_ig",
        "showContact": true,
        "isActive": false,
        "photos": [
          "https://.../photo-0.jpg",
          "https://.../photo-1.jpg"
        ]
      }
    }
    ```

- PATCH `/projects/:id` — update own project (multipart/form-data)
  - Body fields: any of `name`, `description`, `instagramProfile`, `showContact`, `photosToKeep` (comma-separated photo IDs)
  - Files: new photos via `photo0..photo4` or `photos[]` (ensure total kept + new ≤ 5)
  - Resets `isActive=false` until admin approves
  - Response 200:
    ```json
    {
      "message": "Project updated successfully and is now pending admin approval",
      "data": {
        "id": 123,
        "name": "Updated name",
        "description": "Updated desc",
        "instagramProfile": "new_ig",
        "showContact": false,
        "isActive": false,
        "photos": ["https://.../kept.jpg", "https://.../new.jpg"]
      }
    }
    ```

- GET `/projects-self` — get own project
  - Response 200:
    ```json
    {
      "message": "Project fetched successfully",
      "data": {
        "id": 123,
        "name": "My project",
        "description": "...",
        "instagramProfile": "my_ig",
        "showContact": true,
        "photos": [
          { "id": 7, "url": "https://.../photo-0.jpg" },
          { "id": 8, "url": "https://.../photo-1.jpg" }
        ]
      }
    }
    ```

- DELETE `/projects/:id` — delete own project
  - Response 200:
    ```json
    { "message": "Project deleted successfully" }
    ```

- POST `/projects/:projectId/comments` — create comment or reply
  - Body: `projectId` (number; redundant with path, accepted), `parentCommentId?` (number), `content` (string)
  - Response 201:
    ```json
    {
      "message": "Comment created successfully",
      "data": {
        "id": 456,
        "userId": 99,
        "projectId": 123,
        "parentCommentId": null,
        "content": "Great project!"
      }
    }
    ```

- POST `/reports/project` — report a project
  - Body: `projectId` (number), `description` (string)
  - Response 201:
    ```json
    {
      "message": "Report created successfully",
      "data": {
        "id": 321,
        "userId": 99,
        "projectId": 123,
        "description": "Spam or inappropriate",
        "status": "pending"
      }
    }
    ```

- POST `/reports/project-comment` — report a comment
  - Body: `commentId` (number), `description` (string)
  - Response 201:
    ```json
    {
      "message": "Report created successfully",
      "data": {
        "id": 654,
        "userId": 99,
        "commentId": 456,
        "description": "Offensive content",
        "status": "pending"
      }
    }
    ```

### Common errors
- 401 `{ "message": "User is not verified" }`
- 404 `{ "message": "<Resource> not found" }`
- 400 validation errors (e.g., missing fields, photo limits)
- 500 `{ "message": "Failed to <action>", "error": "<details>" }`



'use strict';

// Documentation-style tests for Entrepreneurship feature.
// These tests are intended as specifications for the frontend team.
// They do not perform live HTTP requests; instead, they define example
// payloads and expected response shapes for each endpoint.

/**
 * Auth notes
 * - User-protected endpoints require a valid user token header: Authorization: Bearer <token>
 * - Admin endpoints require admin token header: Authorization: Bearer <adminToken>
 */

describe('Entrepreneurship API specification', () => {
  describe('Public endpoints', () => {
    it('GET /projects — list active projects', () => {
      const exampleResponse = {
        message: 'Projects fetched successfully',
        data: [
          {
            id: 1,
            name: 'Project name',
            description: 'Up to 2000 chars',
            instagramProfile: 'my_ig',
            photos: [
              'https://.../photo-1.jpg',
              'https://.../photo-2.jpg',
            ],
          },
        ],
      };
      void exampleResponse;
    });

    it('GET /projects/:id — get single project (includes owner data only if showContact=true)', () => {
      const exampleResponseWhenShowContactFalse = {
        message: 'Project fetched successfully',
        data: {
          id: 1,
          name: 'Project name',
          description: '...',
          instagramProfile: 'my_ig',
          photos: ['https://.../photo-1.jpg'],
        },
      };

      const exampleResponseWhenShowContactTrue = {
        message: 'Project fetched successfully',
        data: {
          id: 1,
          name: 'Project name',
          description: '...',
          instagramProfile: 'my_ig',
          photos: ['https://.../photo-1.jpg'],
          user: { name: 'John', lastName: 'Doe', email: 'john@example.com' },
        },
      };
      void exampleResponseWhenShowContactFalse;
      void exampleResponseWhenShowContactTrue;
    });

    it('GET /projects/:projectId/comments — get nested comments thread', () => {
      const exampleResponse = {
        message: 'Comments fetched successfully',
        data: [
          {
            id: 10,
            userId: 3,
            projectId: 1,
            content: 'Parent comment',
            parentCommentId: null,
            User: { id: 3, name: 'Alice', lastName: 'Smith' },
            replies: [
              {
                id: 11,
                userId: 4,
                projectId: 1,
                content: 'Reply to parent',
                parentCommentId: 10,
                User: { id: 4, name: 'Bob', lastName: 'Brown' },
                replies: [],
              },
            ],
          },
        ],
      };
      void exampleResponse;
    });
  });

  describe('User-protected endpoints', () => {
    it('POST /projects — create project (multipart/form-data)', () => {
      const exampleFormData = {
        name: 'My project',
        description: 'Up to 2000 chars',
        instagramProfile: 'my_ig',
        showContact: true, // or 'true'
        // Files: photo0..photo4 (or photos[] array)
      };

      const exampleResponse = {
        message: 'Project created successfully and pending admin approval',
        data: {
          id: 123,
          name: 'My project',
          description: 'Up to 2000 chars',
          instagramProfile: 'my_ig',
          showContact: true,
          isActive: false,
          photos: ['https://.../photo-0.jpg', 'https://.../photo-1.jpg'],
        },
      };
      void exampleFormData; void exampleResponse;
    });

    it('PATCH /projects/:id — update own project (multipart/form-data)', () => {
      const exampleBody = {
        name: 'Updated name',
        description: 'Updated desc',
        instagramProfile: 'new_ig',
        showContact: false, // or 'false'
        photosToKeep: '7,8', // comma-separated existing photo IDs to keep
        // Files for new photos: photo0..photo4 or photos[]
      };

      const exampleResponse = {
        message: 'Project updated successfully and is now pending admin approval',
        data: {
          id: 123,
          name: 'Updated name',
          description: 'Updated desc',
          instagramProfile: 'new_ig',
          showContact: false,
          isActive: false,
          photos: ['https://.../kept.jpg', 'https://.../new.jpg'],
        },
      };
      void exampleBody; void exampleResponse;
    });

    it('GET /projects-self — get own project', () => {
      const exampleResponse = {
        message: 'Project fetched successfully',
        data: {
          id: 123,
          name: 'My project',
          description: '...',
          instagramProfile: 'my_ig',
          showContact: true,
          photos: [
            { id: 7, url: 'https://.../photo-0.jpg' },
            { id: 8, url: 'https://.../photo-1.jpg' },
          ],
        },
      };
      void exampleResponse;
    });

    it('DELETE /projects/:id — delete own project', () => {
      const exampleResponse = { message: 'Project deleted successfully' };
      void exampleResponse;
    });

    it('POST /projects/:projectId/comments — create comment or reply', () => {
      const exampleBody = {
        projectId: 123, // redundant with path, accepted
        parentCommentId: null, // or a comment ID for replies
        content: 'Great project!'
      };
      const exampleResponse = {
        message: 'Comment created successfully',
        data: {
          id: 456,
          userId: 99,
          projectId: 123,
          parentCommentId: null,
          content: 'Great project!'
        }
      };
      void exampleBody; void exampleResponse;
    });

    it('POST /reports/project — report a project', () => {
      const exampleBody = { projectId: 123, description: 'Spam or inappropriate' };
      const exampleResponse = {
        message: 'Report created successfully',
        data: { id: 321, userId: 99, projectId: 123, description: 'Spam or inappropriate', status: 'pending' }
      };
      void exampleBody; void exampleResponse;
    });

    it('POST /reports/project-comment — report a comment', () => {
      const exampleBody = { commentId: 456, description: 'Offensive content' };
      const exampleResponse = {
        message: 'Report created successfully',
        data: { id: 654, userId: 99, commentId: 456, description: 'Offensive content', status: 'pending' }
      };
      void exampleBody; void exampleResponse;
    });
  });

  describe('Admin endpoints', () => {
    it('GET /unaccepted-projects — list pending projects for approval', () => {
      const exampleResponse = {
        message: 'Projects fetched successfully',
        data: [
          { id: 123, name: 'My project', isActive: false, userId: 77 },
        ],
      };
      void exampleResponse;
    });

    it('PATCH /projects/accept/:id — accept project (isActive=true)', () => {
      const exampleResponse = { message: 'Project accepted successfully' };
      void exampleResponse;
    });

    it('DELETE /projects/reject/:id — reject project', () => {
      const exampleResponse = { message: 'Project rejected successfully' };
      void exampleResponse;
    });

    it('GET /reports/project — list pending project reports', () => {
      const exampleResponse = {
        message: 'Pending project reports fetched successfully',
        data: [
          {
            id: 1,
            userId: 90,
            description: 'Spam',
            status: 'pending',
            EntrepreuneurProject: {
              id: 123,
              name: 'My project',
              description: '...',
              instagramProfile: 'my_ig',
              showContact: true,
              isActive: false,
              User: { id: 77, name: 'Owner', lastName: 'User', email: 'owner@example.com' }
            },
            User: { id: 90, name: 'Reporter', lastName: 'User', email: 'rep@example.com' }
          },
        ],
      };
      void exampleResponse;
    });

    it('GET /reports/project-comment — list pending comment reports', () => {
      const exampleResponse = {
        message: 'Pending comment reports fetched successfully',
        data: [
          {
            id: 2,
            userId: 90,
            description: 'Offensive',
            status: 'pending',
            EntrepreneurProjectComment: {
              id: 456,
              content: 'Bad words',
              projectId: 123,
              parentCommentId: null,
              User: { id: 88, name: 'Author', lastName: 'User', email: 'author@example.com' },
              EntrepreuneurProject: { id: 123, name: 'My project' }
            },
            User: { id: 90, name: 'Reporter', lastName: 'User', email: 'rep@example.com' }
          },
        ],
      };
      void exampleResponse;
    });

    it('PATCH /reports/project/eliminate — delete project and store decision', () => {
      const exampleBody = {
        reportedByUserId: 90,
        createdByUserId: 77, // project owner
        reportId: 1,
        decisionArgument: 'Clear spam'
      };
      const exampleResponse = { message: 'Project and report handled successfully' };
      void exampleBody; void exampleResponse;
    });

    it('PATCH /reports/project/ignore — ignore project report and store decision', () => {
      const exampleBody = {
        reportedByUserId: 90,
        createdByUserId: 77,
        reportId: 1,
        decisionArgument: 'Not spam'
      };
      const exampleResponse = { message: 'Project report ignored successfully' };
      void exampleBody; void exampleResponse;
    });

    it('PATCH /reports/project-comment/eliminate — delete comment and store decision', () => {
      const exampleBody = {
        reportedByUserId: 90,
        createdByUserId: 88, // comment author
        reportId: 2,
        decisionArgument: 'Hate speech'
      };
      const exampleResponse = { message: 'Comment and report handled successfully' };
      void exampleBody; void exampleResponse;
    });

    it('PATCH /reports/project-comment/ignore — ignore comment report and store decision', () => {
      const exampleBody = {
        reportedByUserId: 90,
        createdByUserId: 88,
        reportId: 2,
        decisionArgument: 'Context acceptable'
      };
      const exampleResponse = { message: 'Comment report ignored successfully' };
      void exampleBody; void exampleResponse;
    });
  });
});



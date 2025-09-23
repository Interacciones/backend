const Router = require('koa-router');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

// Imports - Unprotected Routes
const getAllTutorsProfiles = require('./routes/unprotectedRoutes/tutors/getAllTutors');
const getTutorInfo = require('./routes/unprotectedRoutes/tutors/getTutorInfo');
const createUser = require('./routes/unprotectedRoutes/users/createUser');
const getAllStudySubjects = require('./routes/unprotectedRoutes/studySubjects/getAllSubjects');
const createComplain = require('./routes/unprotectedRoutes/complains/createComplain');

// Imports - User Protected Routes
const getUserProfile = require('./routes/userProtectedRoutes/users/getUserProfile');
const getOwnUserProfile = require('./routes/userProtectedRoutes/users/getOwnUserProfile');
const createReview = require('./routes/userProtectedRoutes/reviews/createReview');
const createTutor = require('./routes/userProtectedRoutes/tutors/createTutor');
const getOwnProfile = require('./routes/userProtectedRoutes/tutors/getOwnProfile');
const updateTutorProfile = require('./routes/userProtectedRoutes/tutors/updateTutorProfile');

const sendEmail = require('./routes/adminRoutes/email/sendEmail');
const getAllStudySubjects = require('./routes/unprotectedRoutes/studySubjects/getAllSubjects');

const checkAdminStatus = require('./routes/adminRoutes/admin/checkAdminStatus');
const promoteUserToAdmin = require('./routes/adminRoutes/admin/promoteUserToAdmin');

// Entrepreneur Project Routes
const getAllProjects = require('./routes/unprotectedRoutes/entrepreneurship/getAllProjects');
const getProject = require('./routes/unprotectedRoutes/entrepreneurship/getProject');
const createProject = require('./routes/userProtectedRoutes/entrepreneurship/createProject');
const updateProject = require('./routes/userProtectedRoutes/entrepreneurship/updateProject');
const getOwnProject = require('./routes/userProtectedRoutes/entrepreneurship/getOwnProject');
const getAllUnacceptedProjects = require('./routes/adminRoutes/entrepreneurship/getAllUnacceptedProjects');
const acceptProject = require('./routes/adminRoutes/entrepreneurship/acceptProject');
const rejectProject = require('./routes/adminRoutes/entrepreneurship/rejectProject');
const deleteOwnProject = require('./routes/userProtectedRoutes/entrepreneurship/deleteOwnProject');
const createEntrepreneurComment = require('./routes/userProtectedRoutes/entrepreneurship/createComment');
const getEntrepreneurComments = require('./routes/unprotectedRoutes/entrepreneurship/getComments');
const createEntrepreneurProjectReport = require('./routes/userProtectedRoutes/reports/createEntrepreneurProjectReport');
const createEntrepreneurCommentReport = require('./routes/userProtectedRoutes/reports/createEntrepreneurCommentReport');
const getUnreviewedEntrepreneurProjectReports = require('./routes/adminRoutes/entrepreneurship/getUnreviewedProjectReports');
const getUnreviewedEntrepreneurCommentReports = require('./routes/adminRoutes/entrepreneurship/getUnreviewedCommentReports');
const eliminateEntrepreneurProjectByReport = require('./routes/adminRoutes/entrepreneurship/eliminateProjectByReport');
const eliminateEntrepreneurCommentByReport = require('./routes/adminRoutes/entrepreneurship/eliminateCommentByReport');
const ignoreEntrepreneurProjectReport = require('./routes/adminRoutes/entrepreneurship/ignoreProjectReport');
const ignoreEntrepreneurCommentReport = require('./routes/adminRoutes/entrepreneurship/ignoreCommentReport');

// Project Category Routes
const getAllCategories = require('./routes/unprotectedRoutes/entrepreneurship/getAllCategories');
const createCategory = require('./routes/adminRoutes/entrepreneurship/createCategory');
const updateCategory = require('./routes/adminRoutes/entrepreneurship/updateCategory');

// Routes

// Users
router.post('/users', createUser);

// Tutors
router.get('/tutors', getAllTutorsProfiles);
router.get('/tutors/:id', getTutorInfo);

// Study Subjects
router.get('/subjects', getAllStudySubjects);

// Complains
router.post('/contact', createComplain);

// ==========================================
// User Protected Routes
// ==========================================

// Users
router.get('/users/:id', getUserProfile);
router.get('/users-self', getOwnUserProfile);

// Reviews
router.post('/reviews', createReview);

// Tutors
router.post('/tutors', createTutor);
router.get('/tutors-self', getOwnProfile);
router.patch('/own-tutor', updateTutorProfile);

// Reports
router.post('/reports/review', createReportOfReview);
router.post('/reports/tutor', createReportOfTutor);

// ==========================================
// Admin Protected Routes
// ==========================================

// Admin Status
router.get('/check-admin', checkAdminStatus);
router.post('/admin/promote-user', promoteUserToAdmin);
router.get('/admin-stats', getAdminStats);
router.get('/admin-stats/comments-per-user', getAmountOfCommentsPerUser);
router.get('/admin-stats/reviews', getTotalReviewsStats);

// Users Management
router.get('/users', getAllUsers);
router.patch('/users/ban/:id', banUser);
router.patch('/users/unban/:id', unbanUser);

// Tutors Management
router.patch('/tutors/accept/:id', acceptTutor);
router.get('/unaccepted-tutors', getUnacceptedTutors);
router.patch('/tutors/reject/:id', rejectTutor);

// Email
router.post("/send-email", sendEmail);

// Study Subjects Management
router.post('/admin/subjects', addStudySubject);
router.delete('/admin/subjects/:id', deleteStudySubject);

// Complains Management
router.get('/admin/complains', getAllComplains);
router.patch('/admin/complains/:id', handleComplain);
router.delete('/admin/complains/:id', deleteComplain);

// Reviews Reports Management
router.get('/reports/review', getUnreviewedReviewReports);
router.patch('/reports/review/eliminate', eliminateReviewByReport);
router.patch('/reports/review/ignore', ignoreReviewReport);

// Tutors Reports Management
router.get('/reports/tutor', getUnreviewedTutorReports);
router.patch('/reports/tutor/eliminate', eliminateTutorByReport);
router.patch('/reports/tutor/ignore', ignoreTutorReport);

// Report History
router.get('/report-history/review', getReviewReportHistory);
router.get('/report-history/tutor', getTutorReportHistory);

// Priority
router.post('/admin/priority', priority);

// Project Categories
router.get('/categories', getAllCategories);
router.post('/admin/categories', createCategory);
router.patch('/admin/categories/:id', updateCategory);

// Entrepreneur Projects
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProject);
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.get('/projects-self', getOwnProject);
router.delete('/projects/:id', deleteOwnProject);
router.get('/projects/:projectId/comments', getEntrepreneurComments);
router.post('/projects/:projectId/comments', createEntrepreneurComment);
router.get('/unaccepted-projects', getAllUnacceptedProjects);
router.patch('/projects/accept/:id', acceptProject);
router.delete('/projects/reject/:id', rejectProject);
router.post('/reports/project', createEntrepreneurProjectReport);
router.post('/reports/project-comment', createEntrepreneurCommentReport);
router.get('/reports/project', getUnreviewedEntrepreneurProjectReports);
router.get('/reports/project-comment', getUnreviewedEntrepreneurCommentReports);
router.patch('/reports/project/eliminate', eliminateEntrepreneurProjectByReport);
router.patch('/reports/project/ignore', ignoreEntrepreneurProjectReport);
router.patch('/reports/project-comment/eliminate', eliminateEntrepreneurCommentByReport);
router.patch('/reports/project-comment/ignore', ignoreEntrepreneurCommentReport);

module.exports = router;

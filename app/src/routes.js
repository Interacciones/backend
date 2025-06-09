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
const createReportOfTutor = require('./routes/userProtectedRoutes/reports/createTutorReport');
const createReportOfReview = require('./routes/userProtectedRoutes/reports/createReviewReport');

// Imports - Admin Protected Routes
const checkAdminStatus = require('./routes/adminRoutes/admin/checkAdminStatus');
const acceptTutor = require('./routes/adminRoutes/tutors/acceptTutor');
const getUnacceptedTutors = require('./routes/adminRoutes/tutors/getUnacceptedTutors');
const rejectTutor = require('./routes/adminRoutes/tutors/rejectTutor');
const banUser = require('./routes/adminRoutes/users/banUser');
const getAllUsers = require('./routes/adminRoutes/users/getAllUsers');
const unbanUser = require('./routes/adminRoutes/users/unbanUser');
const sendEmail = require('./routes/adminRoutes/email/sendEmail');
const getUnreviewedTutorReports = require('./routes/adminRoutes/reports/getUnreviewedTutorReports');
const getUnreviewedReviewReports = require('./routes/adminRoutes/reports/getUnreviewedReviewsReports');
const eliminateReviewByReport = require('./routes/adminRoutes/reports/eliminateReviewByReport');
const eliminateTutorByReport = require('./routes/adminRoutes/reports/eliminateTutorByReport');
const ignoreReviewReport = require('./routes/adminRoutes/reports/ignoreReviewReport');
const ignoreTutorReport = require('./routes/adminRoutes/reports/ignoreTutorReport');
const getAdminStats = require('./routes/adminRoutes/stats/getAdminStats');
const getAmountOfCommentsPerUser = require('./routes/adminRoutes/stats/getAmountOfCommentsPerUser');
const getTotalReviewsStats = require('./routes/adminRoutes/stats/getTotalReviewsStats');
const addStudySubject = require('./routes/adminRoutes/studySubjects/addStudySubject');
const deleteStudySubject = require('./routes/adminRoutes/studySubjects/deleteStudySubject');
const getReviewReportHistory = require('./routes/adminRoutes/reportHistory/getReviewReportHistory');
const getTutorReportHistory = require('./routes/adminRoutes/reportHistory/getTutorReportHistory');
const getAllComplains = require('./routes/adminRoutes/complains/complains');
const handleComplain = require('./routes/adminRoutes/complains/handleComplain');
const deleteComplain = require('./routes/adminRoutes/complains/deleteComplain');
const priority = require('./routes/adminRoutes/priority/priority');

// ==========================================
// ROUTES
// ==========================================

// ==========================================
// Unprotected Routes (Public)
// ==========================================

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

// Admin Stats
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

module.exports = router;

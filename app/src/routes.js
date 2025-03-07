const Router = require('koa-router');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

const getAllTutorsProfiles = require('./routes/unprotectedRoutes/tutors/getAllTutors');
const getUserProfile = require('./routes/userProtectedRoutes/users/getUserProfile');
const createUser = require('./routes/unprotectedRoutes/users/createUser');
const getTutorInfo = require('./routes/unprotectedRoutes/tutors/getTutorInfo');

const acceptTutor = require('./routes/adminRoutes/tutors/acceptTutor');
const getUnacceptedTutors = require('./routes/adminRoutes/tutors/getUnacceptedTutors');
const rejectTutor = require('./routes/adminRoutes/tutors/rejectTutor');

const banUser = require('./routes/adminRoutes/users/banUser');
const getAllUsers = require('./routes/adminRoutes/users/getAllUsers');
const unbanUser = require('./routes/adminRoutes/users/unbanUser');
const getOwnUserProfile = require('./routes/userProtectedRoutes/users/getOwnUserProfile');

const createReview = require('./routes/userProtectedRoutes/reviews/createReview');

const createTutor = require('./routes/userProtectedRoutes/tutors/createTutor');
const getOwnProfile = require('./routes/userProtectedRoutes/tutors/getOwnProfile');
const updateTutorProfile = require('./routes/userProtectedRoutes/tutors/updateTutorProfile');

const sendEmail = require('./routes/adminRoutes/email/sendEmail');
const getAllStudySubjects = require('./routes/unprotectedRoutes/studySubjects/getAllSubjects');

const checkAdminStatus = require('./routes/adminRoutes/admin/checkAdminStatus');

const createReportOfTutor = require('./routes/userProtectedRoutes/reports/createTutorReport');
const createReportOfReview = require('./routes/userProtectedRoutes/reports/createReviewReport');
const getUnreviewedTutorReports = require('./routes/adminRoutes/reports/getUnreviewedTutorReports');
const getUnreviewedReviewReports = require('./routes/adminRoutes/reports/getUnreviewedReviewsReports');
const eliminateReviewByReport = require('./routes/adminRoutes/reports/eliminateReviewByReport');
const eliminateTutorByReport = require('./routes/adminRoutes/reports/eliminateTutorByReport');
const ignoreReviewReport = require('./routes/adminRoutes/reports/ignoreReviewReport');
const ignoreTutorReport = require('./routes/adminRoutes/reports/ignoreTutorReport');

const getAdminStats = require('./routes/adminRoutes/stats/getAdminStats');
const getAmountOfCommentsPerUser = require('./routes/adminRoutes/stats/getAmountOfCommentsPerUser');

const addStudySubject = require('./routes/adminRoutes/studySubjects/addStudySubject');
const deleteStudySubject = require('./routes/adminRoutes/studySubjects/deleteStudySubject');

const getReviewReportHistory = require('./routes/adminRoutes/reportHistory/getReviewReportHistory');
const getTutorReportHistory = require('./routes/adminRoutes/reportHistory/getTutorReportHistory');

const createComplain = require('./routes/unprotectedRoutes/complains/createComplain');
const getAllComplains = require('./routes/adminRoutes/complains/complains');
const handleComplain = require('./routes/adminRoutes/complains/handleComplain');
const deleteComplain = require('./routes/adminRoutes/complains/deleteComplain');

const priority = require('./routes/adminRoutes/priority/priority');

// Routes

// Users
router.get('/users/:id', getUserProfile);
router.get('/users-self', getOwnUserProfile);
router.post('/users', createUser);
router.patch('/users/ban/:id', banUser);
router.get('/users', getAllUsers);
router.patch('/users/unban/:id', unbanUser);

// Tutors
router.get('/tutors', getAllTutorsProfiles);
router.get('/tutors/:id', getTutorInfo);
router.patch('/tutors/accept/:id', acceptTutor);
router.get('/unaccepted-tutors', getUnacceptedTutors);
router.patch('/tutors/reject/:id', rejectTutor);
router.post('/tutors', createTutor);
router.get('/tutors-self', getOwnProfile);
router.patch('/own-tutor', updateTutorProfile);

// Reviews
router.post('/reviews', createReview);

// Send Email
router.post("/send-email", sendEmail);

// Study Subjects
router.get('/subjects', getAllStudySubjects);
router.post('/admin/subjects', addStudySubject);
router.delete('/admin/subjects/:id', deleteStudySubject);

// Admin
router.get('/check-admin', checkAdminStatus);
router.get('/admin-stats', getAdminStats);
router.get('/admin-stats/comments-per-user', getAmountOfCommentsPerUser);

// Complains
router.post('/contact', createComplain);
router.get('/admin/complains', getAllComplains);
router.patch('/admin/complains/:id', handleComplain);
router.delete('/admin/complains/:id', deleteComplain);

// Reviews Reports
router.post('/reports/review', createReportOfReview);
router.patch('/reports/review/eliminate', eliminateReviewByReport);
router.patch('/reports/review/ignore', ignoreReviewReport);
router.patch('/reports/tutor/eliminate', eliminateTutorByReport);

// Tutors Reports
router.post('/reports/tutor', createReportOfTutor);
router.patch('/reports/tutor/ignore', ignoreTutorReport);

// Admin Report History
router.get('/reports/review', getUnreviewedReviewReports);
router.get('/reports/tutor', getUnreviewedTutorReports);

// Report History
router.get('/report-history/review', getReviewReportHistory);
router.get('/report-history/tutor', getTutorReportHistory);

// Priority
router.post('/admin/priority', priority);

module.exports = router;

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

const createReview = require('./routes/userProtectedRoutes/reviews/createReview');

const createTutor = require('./routes/userProtectedRoutes/tutors/createTutor');
const getOwnProfile = require('./routes/userProtectedRoutes/tutors/getOwnProfile');
const updateTutorProfile = require('./routes/userProtectedRoutes/tutors/updateTutorProfile');

const getAllStudySubjects = require('./routes/unprotectedRoutes/studySubjects/getAllSubjects');

const checkAdminStatus = require('./routes/adminRoutes/admin/checkAdminStatus');

const createReportOfTutor = require('./routes/userProtectedRoutes/reports/createTutorReport');
const createReportOfReview = require('./routes/userProtectedRoutes/reports/createReviewReport');
const getUnreviewedTutorReports = require('./routes/adminRoutes/reports/getUnreviewedTutorReports');
const getUnreviewedReviewReports = require('./routes/adminRoutes/reports/getUnreviewedReviewsReports');

const getAdminStats = require('./routes/adminRoutes/stats/getAdminStats');

// Routes

// Users
router.get('/users/:id', getUserProfile);
router.post('/users', createUser);
router.patch('/users/ban', banUser);
router.get('/users', getAllUsers);
router.patch('/users/unban', unbanUser);

// Tutors
router.get('/tutors', getAllTutorsProfiles);
router.get('/tutors/:id', getTutorInfo);
router.patch('/tutors/accept/:id', acceptTutor); // Ahora en el front se está enviando el correo /:id
router.get('/unaccepted-tutors', getUnacceptedTutors);
router.patch('/tutors/reject/:id', rejectTutor); // Ahora en el front se está enviando el correo /:id
router.post('/tutors', createTutor);
router.get('/tutors-self', getOwnProfile);
router.patch('/own-tutor', updateTutorProfile);

// Reviews
router.post('/reviews', createReview);

// Study Subjects
router.get('/subjects', getAllStudySubjects);

// Admin
router.get('/check-admin', checkAdminStatus);
router.get('/admin-stats', getAdminStats);

// Reviews Reports
router.post('/reports/review', createReportOfReview);

// Tutors Reports
router.post('/reports/tutor', createReportOfTutor);

// Admin Report History
router.get('/reports/review', getUnreviewedReviewReports);
router.get('/reports/tutor', getUnreviewedTutorReports);

module.exports = router;

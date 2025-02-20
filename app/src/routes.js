const Router = require('koa-router');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

const getAllTutorsProfiles = require('./routes/unprotectedRoutes/tutors/getAllTutors');
const getUserProfile = require('./routes/userProtectedRoutes/users/getUserProfile');
const createUser = require('./routes/unprotectedRoutes/users/createUser');

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

const sendEmail = require('./routes/adminRoutes/email/sendEmail');

// Routes

// Users
router.get('/users/:id', getUserProfile);
router.post('/users', createUser);
router.patch('/users/ban', banUser);
router.get('/users', getAllUsers);
router.patch('/users/unban', unbanUser);

// Tutors
router.get('/tutors', getAllTutorsProfiles);
router.patch('/tutors/accept', acceptTutor);
router.get('/tutors/unaccepted', getUnacceptedTutors);
router.patch('/tutors/reject', rejectTutor);
router.post('/tutors', createTutor);
router.get('/tutors/self', getOwnProfile);
router.patch('/tutors', updateTutorProfile);

// Reviews
router.post('/reviews', createReview);

// Send Email
router.post("/send-email", sendEmail);

module.exports = router;

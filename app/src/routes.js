const Router = require('koa-router');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

const getAllTutorsProfiles = require('./routes/unprotectedRoutes/tutors/getAllTutors');
const getUserProfile = require('./routes/userProtectedRoutes/users/getUserProfile');
const createUser = require('./routes/unprotectedRoutes/users/createUser');
const getTutorInfo = require('./routes/unprotectedRoutes/tutors/getTutorInfo');

// Routes

// Users
router.get('/users/:id', getUserProfile);
router.post('/users', createUser);

// Tutors
router.get('/tutors', getAllTutorsProfiles);
router.get('/tutors/:id', getTutorInfo);



module.exports = router;

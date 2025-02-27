const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getUnacceptedTutorProfiles() {
    return await db.TutorProfile.findAll({
        where: { isPublished: false },
        attributes: ['id', 'description', 'photo', 'priceDescription', 'contactNumber', 'isPublished'],
        include: [
            {
                model: db.User,
                attributes: ['name', 'lastName', 'email'],
            }
        ],
    });
}

async function getSubjectsForTutor(tutorId) {
    return await db.TutorSubjects.findAll({
        where: { idTutor: tutorId },
        include: {
            model: db.StudySubjects,
            attributes: ['subject'],
        },
    });
}

async function getCoursesForTutor(tutorId) {
    return await db.TutorCourses.findAll({
        where: { idTutor: tutorId },
        attributes: ['subject'],
    });
}

async function getUnacceptedTutorProfilesWithDetails() {
    const profiles = await getUnacceptedTutorProfiles();

    const profilesWithDetails = await Promise.all(
        profiles.map(async (profile) => {
            const subjects = await getSubjectsForTutor(profile.id);
            const courses = await getCoursesForTutor(profile.id);
            const profileData = profile.toJSON();
            return {
                ...profileData,
                name: profileData.User.name,
                lastName: profileData.User.lastName,
                email: profileData.User.email,
                subjects: subjects.map((subject) => subject.StudySubject.subject),
                courses: courses.map((course) => course.subject),
            };
        })
    );

    return profilesWithDetails.map(profile => {
        const { User, ReviewsPerTutor, ...rest } = profile;
        return rest;
    });
}

module.exports = async (ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
            };
            ctx.status = 401;
            return;
        }

        const unacceptedTutorProfiles = await getUnacceptedTutorProfilesWithDetails();

        ctx.body = {
            message: 'Unaccepted tutor profiles fetched successfully',
            data: unacceptedTutorProfiles,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch unaccepted tutor profiles',
            error: error.message,
        };
        ctx.status = 500;
    }
};
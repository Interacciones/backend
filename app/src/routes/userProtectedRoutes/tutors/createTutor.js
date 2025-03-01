const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const { uploadFile } = require('../../../services/s3');

async function uploadProfilePicture(userId, photo) {
    if (!photo) {
        return "https://interac-ciones.s3.amazonaws.com/default.jpg";
    }

    try {
        const imageKey = `tutor_${userId}_profile_picture.jpg`;
        const imagePath = await uploadFile(imageKey, photo);
        return imagePath;
    } catch (error) {
        console.error('Error uploading Profile Picture: ', error);
        return "https://interac-ciones.s3.amazonaws.com/default.jpg";
    }
}

async function createTutorProfile(user, description, priceDescription, photoLink, contactNumber) {
    return await db.TutorProfile.create({
        userId: user.id,
        description,
        priceDescription,
        photo: photoLink,
        contactNumber,
        isPublished: false,
    });
}

async function createTutorCourses(idTutor, courses) {
    const uniqueCourses = [...new Set(courses.map(course => course.course))];
    for (const course of uniqueCourses) {
        await db.TutorCourses.create({
            idTutor,
            subject: course,
        });
    }
}

async function createTutorSubjects(idTutor, subjects) {
    const uniqueSubjects = [...new Set(subjects.map(subject => subject.subject))];
    for (const subject of uniqueSubjects) {
        const studySubject = await db.StudySubjects.findOne({
            where: { subject },
        });
        if (studySubject) {
            await db.TutorSubjects.create({
                idTutor,
                idSubject: studySubject.id,
            });
        }
    }
}

module.exports = async (ctx) => {
    try {
        const userToken = await checkVerifiedUser(ctx);
        if (!userToken) {
            ctx.body = { message: 'User is not verified' };
            ctx.status = 401;
            return;
        }

        const { description, priceDescription, courses, contactNumber } = ctx.request.body;
        const parsedCourses = JSON.parse(courses);
        const photo = ctx.request.files.photo;

        const user = await db.User.findOne({ where: { token: userToken.uid } });

        const photoLink = await uploadProfilePicture(user.id, photo);

        const tutorProfile = await createTutorProfile(user, description, priceDescription, photoLink, contactNumber);

        await createTutorCourses(tutorProfile.id, parsedCourses);
        await createTutorSubjects(tutorProfile.id, parsedCourses);

        ctx.body = {
            message: 'Tutor profile created successfully',
            data: tutorProfile,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to create tutor profile',
            error: error.message,
        };
        ctx.status = 500;
    }
};
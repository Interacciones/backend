const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const { uploadFile } = require('../../../services/s3');
const { sendEmailNotification } = require('../../../services/emailService');

async function uploadProfilePicture(userId, photo) {
    if (!photo) {
        return null;
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

async function updateTutorProfileDetails(tutorProfile, details) {
    tutorProfile.description = details.description || tutorProfile.description;
    tutorProfile.priceDescription = details.priceDescription || tutorProfile.priceDescription;
    tutorProfile.photo = details.photo || tutorProfile.photo;
    tutorProfile.contactNumber = details.contactNumber || tutorProfile.contactNumber;
    tutorProfile.isPublished = false;

    await tutorProfile.save();
}

async function updateTutorCourses(tutorId, courses) {
    if (!courses){
        return;
    }
    const parsedCourses = JSON.parse(courses);
    await db.TutorCourses.destroy({ where: { idTutor: tutorId } });
    for (const course of parsedCourses) {
        await db.TutorCourses.create({
            idTutor: tutorId,
            subject: course,
        });
    }
}

async function updateTutorSubjects(tutorId, subjects) {
    if (!subjects){
        return;
    }
    const parsedSubjects = JSON.parse(subjects);
    await db.TutorSubjects.destroy({ where: { idTutor: tutorId } });
    for (const subject of parsedSubjects) {
        const studySubject = await db.StudySubjects.findOne({
            where: { subject },
        });
        if (studySubject) {
            await db.TutorSubjects.create({
                idTutor: tutorId,
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

        const user = await db.User.findOne({ where: { token: userToken.uid } });
        if (!user) {
            ctx.body = { message: 'User not found' };
            ctx.status = 404;
            return;
        }

        const { description, courses, subjects, contactNumber, priceDescription } = ctx.request.body;
        const photo = ctx.request.files.photo;
        const photoLink = await uploadProfilePicture(user.id, photo);

        const tutorProfile = await db.TutorProfile.findOne({ where: { userId: user.id } });
        if (!tutorProfile) {
            ctx.body = { message: 'Tutor profile not found' };
            ctx.status = 404;
            return;
        }

        await updateTutorProfileDetails(tutorProfile, { description, priceDescription, photo: (photoLink || tutorProfile.photo), contactNumber });
        await updateTutorCourses(tutorProfile.id, courses);
        await updateTutorSubjects(tutorProfile.id, subjects);

        const adminEmail = process.env.GMAIL_USER;
        const emailSubject = 'Actualización de perfil de tutor';
        const emailBody = `El tutor ${user.name} ${user.lastName} ha actualizado su perfil.`;

        await sendEmailNotification(adminEmail, emailSubject, emailBody);

        ctx.body = {
            message: 'Tutor profile updated successfully',
            data: tutorProfile,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to update tutor profile',
            error: error.message,
        };
        ctx.status = 500;
    }
};
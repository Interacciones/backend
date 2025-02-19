const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

module.exports = async(ctx) => {
    try {
        const userToken = await checkVerifiedUser(ctx);
        if (!userToken) {
            ctx.body = {
                message: 'User is not verified',
            };
            ctx.status = 401;
            return;
        }
        const user = await db.User.findOne({
            where: { token: userToken.uid },
        });

        const { description, courses, subjects, photo, contactNumber, priceDescription } = ctx.request.body;

        console.log('Description:', description);
        console.log('Courses:', courses);
        console.log('Subjects:', subjects);
        console.log('Photo:', photo);
        console.log('Contact Number:', contactNumber);
        console.log('Price Description:', priceDescription);

        const tutorProfile = await db.TutorProfile.findOne({
            where: { userId: user.id },
        });

        tutorProfile.description = description || tutorProfile.description;
        tutorProfile.priceDescription = priceDescription || tutorProfile.priceDescription;
        tutorProfile.photo = photo || tutorProfile.photo;
        tutorProfile.contactNumber = contactNumber || tutorProfile.contactNumber;
        tutorProfile.isPublished = false;

        await tutorProfile.save();

        // Update courses
        const parsedCourses = JSON.parse(courses);
        await db.TutorCourses.destroy({ where: { idTutor: tutorProfile.id } });
        for (const course of parsedCourses) {
            await db.TutorCourses.create({
                idTutor: tutorProfile.id,
                subject: course,
            });
        }

        // Update subjects
        const parsedSubjects = JSON.parse(subjects);
        await db.TutorSubjects.destroy({ where: { idTutor: tutorProfile.id } });
        for (const subject of parsedSubjects) {
            const studySubject = await db.StudySubjects.findOne({
                where: { subject },
            });
            if (studySubject) {
                await db.TutorSubjects.create({
                    idTutor: tutorProfile.id,
                    idSubject: studySubject.id,
                });
            }
        }

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
/*
Para esta ruta hacer:
Pedir el perfil de tutor de la persona a través de buscar el token del usuario, encontrar el usuario y encontrar con esto el perfil de tutor
*/

const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');

const getTutorProfileByUserId = async (userId) => {
  try {
    return await db.TutorProfile.findOne({
      where: { userId },
      attributes: ['id', 'description', 'photo', 'priceDescription', 'contactNumber', 'isPublished'],
      include: [
        {
          model: db.TutorSubjects,
          attributes: ['id'],
          include: [
            {
              model: db.StudySubjects,
              attributes: ['subject'],
            },
          ],
        },
        {
          model: db.TutorCourses,
          attributes: ['id', 'subject'],
        }
      ],
    });
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    throw error;
  }
};

module.exports = async (ctx) => {
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

    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }

    const tutorProfile = await getTutorProfileByUserId(user.id);

    if (!tutorProfile) {
      ctx.status = 404;
      ctx.body = { message: 'Tutor profile not found' };
      return;
    }

    const responseData = {
      ...tutorProfile.toJSON(),
      subjects: tutorProfile.TutorSubjects.map(subject => subject.StudySubject.subject),
      courses: tutorProfile.TutorCourses.map(course => course.subject),
    };

    delete responseData.TutorSubjects;
    delete responseData.TutorCourses;

    ctx.body = {
      message: 'Tutor profile fetched successfully',
      data: responseData,
    };
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = {
      message: 'Failed to fetch tutor profile',
      error: error.message,
    };
    ctx.status = 500;
  }
};
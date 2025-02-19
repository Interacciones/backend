const db = require('../../../models');

const getTutorById = async (tutorId) => {
  try {
    return await db.TutorProfile.findOne({
      where: { id: tutorId },
      attributes: ['id', 'description', 'photo', 'priceDescription', 'contactNumber', 'isPublished'],
      include: [
        {
          model: db.TutorSubjects,
          as: 'Subjects',
          attributes: ['id'],
          include: [
            {
              model: db.StudySubjects,
              as: 'StudySubject',
              attributes: ['subject'],
            },
          ],
        },
        {
          model: db.TutorCourses,
          as: 'Courses',
          attributes: ['id', 'subject'],
        },
        {
          model: db.User,
          as: 'User',
          attributes: ['name', 'lastName', 'email'],
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching tutor data:', error);
    throw error;
  }
};

// Solo se llaman a las primeras 3 reviews
const getTutorReviews = async (tutorId) => {
  try {
    return await db.ReviewMessage.findAll({
      where: { tutorId },
      attributes: ['id', 'rating', 'content'],
      limit: 3,
    });
  } catch (error) {
    console.error('Error fetching tutor reviews:', error);
    throw error;
  }
};

module.exports = async (ctx) => {
  try {
    const tutorId = ctx.params.id;

    if (!tutorId) {
      ctx.status = 400;
      ctx.body = { message: 'Tutor ID is required' };
      return;
    }

    const tutorData = await getTutorById(tutorId);
    const reviews = await getTutorReviews(tutorId);

    if (!tutorData) {
      ctx.status = 404;
      ctx.body = { message: 'Tutor not found' };
      return;
    }

    const responseData = {
      ...tutorData.toJSON(),
      name: tutorData.User.name,
      lastName: tutorData.User.lastName,
      email: tutorData.User.email,
      subjects: tutorData.Subjects.map(subject => subject.StudySubject.subject),
      courses: tutorData.Courses.map(course => course.subject),
    };

    delete responseData.Subjects;
    delete responseData.Courses;
    delete responseData.User;

    ctx.status = 200;
    ctx.body = {
      message: 'Tutor fetched successfully',
      data: {
        ...responseData,
        reviews,
      },
    };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = {
      message: 'Failed to fetch tutor',
      error: error.message,
    };
  }
};

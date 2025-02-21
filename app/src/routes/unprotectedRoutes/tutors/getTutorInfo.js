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
        {
          model: db.ReviewsPerTutor,
          attributes: ['avgRating', 'reviewAmount', 'oneStarReviews', 'twoStarReviews', 'threeStarReviews', 'fourStarReviews', 'fiveStarReviews'],
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching tutor data:', error);
    throw error;
  }
};

const getTutorReviews = async (tutorId) => {
  try {
    return await db.ReviewMessage.findAll({
      where: { tutorId },
      attributes: ['id', 'rating', 'content', 'createdAt'],
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
      avgRating: tutorData.ReviewsPerTutor ? tutorData.ReviewsPerTutor.avgRating : null,
      reviewAmount: tutorData.ReviewsPerTutor ? tutorData.ReviewsPerTutor.reviewAmount : null,
      oneStarReviews: tutorData.ReviewsPerTutor ? tutorData.ReviewsPerTutor.oneStarReviews : null,
      twoStarReviews: tutorData.ReviewsPerTutor ? tutorData.ReviewsPerTutor.twoStarReviews : null,
      threeStarReviews: tutorData.ReviewsPerTutor ? tutorData.ReviewsPerTutor.threeStarReviews : null,
      fourStarReviews: tutorData.ReviewsPerTutor ? tutorData.ReviewsPerTutor.fourStarReviews : null,
      fiveStarReviews: tutorData.ReviewsPerTutor ? tutorData.ReviewsPerTutor.fiveStarReviews : null,
    };

    delete responseData.Subjects;
    delete responseData.Courses;
    delete responseData.User;
    delete responseData.ReviewsPerTutor;

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

const db = require('../../../models');

const getTutorById = async (tutorId) => {
  try {
    return await db.TutorProfile.findOne({
      where: { id: tutorId },
      attributes: ['id', 'description', 'photo', 'priceDescription', 'contactMail', 'isPublished'],
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
      ],
    });
  } catch (error) {
    console.error('Error fetching tutor data:', error);
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

    if (!tutorData) {
      ctx.status = 404;
      ctx.body = { message: 'Tutor not found' };
      return;
    }

    const responseData = {
      ...tutorData.toJSON(),
      subjects: tutorData.Subjects.map(subject => subject.StudySubject.subject),
      courses: tutorData.Courses.map(course => course.subject),
    };

    delete responseData.Subjects;
    delete responseData.Courses;

    ctx.status = 200;
    ctx.body = {
      message: 'Tutor fetched successfully',
      data: responseData,
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

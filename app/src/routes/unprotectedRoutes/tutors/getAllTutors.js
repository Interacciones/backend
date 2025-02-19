const db = require('../../../models');

async function getTutorProfiles() {
  return await db.TutorProfile.findAll({
    attributes: ['id', 'description', 'photo', 'priceDescription', 'contactNumber', 'isPublished'],
  });
}

async function getSubjectsForTutor(tutorId) {
  return await db.TutorSubjects.findAll({
    where: { idTutor: tutorId },
    include: {
      model: db.StudySubjects,
      as: 'StudySubject',
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

async function getTutorProfilesWithSubjectsAndCourses() {
  const profiles = await getTutorProfiles();

  const profilesWithDetails = await Promise.all(
    profiles.map(async (profile) => {
      const subjects = await getSubjectsForTutor(profile.id);
      const courses = await getCoursesForTutor(profile.id);
      return {
        ...profile.toJSON(),
        subjects: subjects.map((subject) => subject.StudySubject.subject),
        courses: courses.map((course) => course.subject),
      };
    })
  );

  return profilesWithDetails;
}

module.exports = async (ctx) => {
  try {
    const tutorProfiles = await getTutorProfilesWithSubjectsAndCourses();

    ctx.body = {
      message: 'Tutor profiles fetched successfully',
      data: tutorProfiles,
    };
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = {
      message: 'Failed to fetch tutor profiles',
      error: error.message,
    };
    ctx.status = 500;
  }
};

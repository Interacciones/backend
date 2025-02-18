const db = require('../../../models');

module.exports = async (ctx) => {
  try {
    const getTutorProfiles = async () => {
      return await db.TutorProfile.findAll({
        attributes: ['id', 'description', 'photo', 'priceDescription', 'contactNumber', 'isPublished'],
      });
    };


    const getSubjectsForTutor = async (tutorId) => {
      return await db.TutorSubjects.findAll({
        where: { idTutor: tutorId },
        include: {
          model: db.StudySubjects,
          attributes: ['subject'],
        },
      });
    };


    const getTutorProfilesWithSubjects = async () => {
      const profiles = await getTutorProfiles();

      const profilesWithSubjects = await Promise.all(
        profiles.map(async (profile) => {
          const subjects = await getSubjectsForTutor(profile.id);
          return {
            ...profile.toJSON(),
            subjects: subjects.map((subject) => subject.StudySubject.subject),
          };
        })
      );

      return profilesWithSubjects;
    };


    const tutorProfiles = await getTutorProfilesWithSubjects();

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

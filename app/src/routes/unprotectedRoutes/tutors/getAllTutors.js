const db = require('../../../models');
const { Op } = require('sequelize');

const ALLOWED_QUANTITIES = [9, 15, 21];
const DEFAULT_QUANTITY = 15;

async function getTutorProfiles(limit, offset, filters) {
  const { nombre, curso, area } = filters;

  const whereClause = {
    isPublished: true,
  };

  if (nombre) {
    whereClause['$User.name$'] = { [Op.like]: `%${nombre}%` };
    whereClause['$User.lastName$'] = { [Op.like]: `%${nombre}%` };
  }

  const includeClause = [
    {
      model: db.User,
      attributes: ['name', 'lastName'],
    },
    {
      model: db.ReviewsPerTutor,
      attributes: ['avgRating'],
    },
    {
      model: db.TutorPriority,
      attributes: [], // No necesitamos atributos de TutorPriority, solo la relación
      required: false, // LEFT JOIN
    },
  ];

  if (curso) {
    includeClause.push({
      model: db.TutorCourses,
      where: { subject: { [Op.like]: `%${curso}%` } },
      attributes: [],
    });
  }

  if (area) {
    includeClause.push({
      model: db.TutorSubjects,
      where: { '$StudySubjects.subject$': { [Op.like]: `%${area}%` } },
      include: {
        model: db.StudySubjects,
        attributes: [],
      },
      attributes: [],
    });
  }

  return await db.TutorProfile.findAndCountAll({
    where: whereClause,
    attributes: [
      'id', 
      'description', 
      'photo', 
      'priceDescription', 
      'contactNumber', 
      'isPublished',
      [db.Sequelize.literal('"TutorPriority"."idTutor" IS NOT NULL'), 'hasPriority']
    ],
    include: includeClause,
    limit,
    offset,
    order: [
      [db.Sequelize.literal('"hasPriority"'), 'DESC'], // Prioriza los tutores en TutorPriority
      ['id', 'ASC'], // Orden secundario por id
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

async function getTutorProfilesWithSubjectsAndCourses(limit, offset, filters) {
  const { rows: profiles, count: totalCount } = await getTutorProfiles(limit, offset, filters);

  const profilesWithDetails = await Promise.all(
    profiles.map(async (profile) => {
      const subjects = await getSubjectsForTutor(profile.id);
      const courses = await getCoursesForTutor(profile.id);
      const profileData = profile.toJSON();
      return {
        ...profileData,
        name: profileData.User ? profileData.User.name : null,
        lastName: profileData.User ? profileData.User.lastName : null,
        subjects: subjects.map((subject) => subject.StudySubject ? subject.StudySubject.subject : null),
        courses: courses.map((course) => course.subject),
        avgRating: profileData.ReviewsPerTutor ? profileData.ReviewsPerTutor.avgRating : null,
      };
    })
  );

  return {
    profiles: profilesWithDetails.map(profile => {
      const { User, ReviewsPerTutor, ...rest } = profile;
      return rest;
    }),
    totalCount,
  };
}

module.exports = async (ctx) => {
  try {
    const { cantidad, pagina, nombre, curso, area } = ctx.query;
    const limit = ALLOWED_QUANTITIES.includes(parseInt(cantidad)) ? parseInt(cantidad) : DEFAULT_QUANTITY;
    const page = parseInt(pagina) || 1;
    const offset = (page - 1) * limit;

    const filters = { nombre, curso, area };

    const { profiles, totalCount } = await getTutorProfilesWithSubjectsAndCourses(limit, offset, filters);

    ctx.body = {
      message: 'Tutor profiles fetched successfully',
      data: profiles,
      totalCount,
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

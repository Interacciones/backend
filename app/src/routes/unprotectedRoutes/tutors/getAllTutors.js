const db = require('../../../models');
const { Op, fn, col, where } = require('sequelize');

const ALLOWED_QUANTITIES = [9, 15, 21];
const DEFAULT_QUANTITY = 15;

async function getTutorProfiles(limit, offset, filters) {
  const { course, idSubject } = filters;

  const whereClause = {
    isPublished: true,
  };

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
      required: false,
    },
  ];
  
  // Configure query options
  const options = {
    where: whereClause,
    include: includeClause,
    order: [
      [db.TutorPriority, 'idTutor', 'ASC'],
      ['id', 'ASC'],
    ],
    attributes: [
      'id', 
      'description', 
      'photo', 
      'priceDescription', 
      'contactNumber', 
      'isPublished'
    ],
  };

  if (course) {
    includeClause.push({
      model: db.TutorCourses,
      where: where(
        fn('LOWER', fn('UNACCENT', col('TutorCourses.subject'))),
        { 
          [Op.like]: `%${course.toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')}%` 
        }
      ),
      attributes: [],
    });
  }

  if (idSubject) {
    includeClause.push({
      model: db.TutorSubjects,
      where: { idSubject },
      include: {
        model: db.StudySubjects,
        attributes: [],
      },
      attributes: [],
    });
  }

  // Only add limit and offset if they are provided
  if (limit !== null && offset !== null) {
    options.limit = limit;
    options.offset = offset;
  }

  return await db.TutorProfile.findAndCountAll(options);
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
  // Get all profiles without limit and offset to count them properly
  const { rows: allProfiles } = await getTutorProfiles(null, null, filters);
  const totalCount = allProfiles.length;

  // Now get the paginated profiles
  const { rows: profiles } = await getTutorProfiles(limit, offset, filters);

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
    const { cantidad, pagina, course, idSubject } = ctx.query;
    const limit = ALLOWED_QUANTITIES.includes(parseInt(cantidad)) ? parseInt(cantidad) : DEFAULT_QUANTITY;
    const page = parseInt(pagina) || 1;
    const offset = (page - 1) * limit;

    const filters = { course, idSubject };

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

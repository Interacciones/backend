const db = require('../../../models');

async function createInitialReviewsPerTutorRecord(tutorId) {
  await db.ReviewsPerTutor.create({
    tutorId,
    avgRating: 0,
    reviewAmount: 0,
    oneStarReviews: 0,
    twoStarReviews: 0,
    threeStarReviews: 0,
    fourStarReviews: 0,
    fiveStarReviews: 0,
  });
}

module.exports = createInitialReviewsPerTutorRecord;
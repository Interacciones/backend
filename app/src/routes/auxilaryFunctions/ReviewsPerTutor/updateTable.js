const db = require('../../../models');

async function updateReviewsPerTutor(tutorId, lastReviewRating, isAdding) {
  const reviewsPerTutor = await db.ReviewsPerTutor.findOne({
    where: { tutorId },
  });

  if (!reviewsPerTutor) {
    throw new Error('ReviewsPerTutor record not found');
  }

  const reviewAmount = isAdding ? reviewsPerTutor.reviewAmount + 1 : reviewsPerTutor.reviewAmount - 1;
  const totalRating = (reviewsPerTutor.avgRating * reviewsPerTutor.reviewAmount) + (isAdding ? lastReviewRating : -lastReviewRating);
  const avgRating = reviewAmount > 0 ? totalRating / reviewAmount : 0;

  const oneStarReviews = lastReviewRating === 1 ? (isAdding ? reviewsPerTutor.oneStarReviews + 1 : reviewsPerTutor.oneStarReviews - 1) : reviewsPerTutor.oneStarReviews;
  const twoStarReviews = lastReviewRating === 2 ? (isAdding ? reviewsPerTutor.twoStarReviews + 1 : reviewsPerTutor.twoStarReviews - 1) : reviewsPerTutor.twoStarReviews;
  const threeStarReviews = lastReviewRating === 3 ? (isAdding ? reviewsPerTutor.threeStarReviews + 1 : reviewsPerTutor.threeStarReviews - 1) : reviewsPerTutor.threeStarReviews;
  const fourStarReviews = lastReviewRating === 4 ? (isAdding ? reviewsPerTutor.fourStarReviews + 1 : reviewsPerTutor.fourStarReviews - 1) : reviewsPerTutor.fourStarReviews;
  const fiveStarReviews = lastReviewRating === 5 ? (isAdding ? reviewsPerTutor.fiveStarReviews + 1 : reviewsPerTutor.fiveStarReviews - 1) : reviewsPerTutor.fiveStarReviews;

  await db.ReviewsPerTutor.update({
    avgRating,
    reviewAmount,
    oneStarReviews,
    twoStarReviews,
    threeStarReviews,
    fourStarReviews,
    fiveStarReviews
  }, {
    where: { tutorId }
  });
}

module.exports = updateReviewsPerTutor;
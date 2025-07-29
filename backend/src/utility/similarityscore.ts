export const computeSimilarityRating = (
  score: number
): { match: string; rating: number } => {
  let matchQuality = "";
  const normScore = Math.round(score * 100);
  if (score > 0.85) {
    matchQuality = "Your resume is an excellent match for this job!";
  } else if (score > 0.7) {
    matchQuality = "Your resume is good match for this job!";
  } else {
    matchQuality =
      "Your resume is a weak match for this job. Consider rewriting your resume to improve alignment!";
  }
  return { match: matchQuality, rating: normScore };
};


export function validateRating(rating: any): string | null {
  if (rating === undefined || rating === null) {
    return 'Rating is required';
  }
  
  const numericRating = Number(rating);
  
  if (isNaN(numericRating)) {
    return 'Rating must be a number';
  }
  
  if (!Number.isInteger(numericRating)) {
    return 'Rating must be a whole number';
  }
  
  if (numericRating < 1 || numericRating > 5) {
    return 'Rating must be between 1 and 5';
  }
  
  return null;
}

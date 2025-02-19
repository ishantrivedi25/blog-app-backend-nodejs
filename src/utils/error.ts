export const createErrorResponse = (
  statusCode: number,
  message: string
): Error => {
  const error = new Error(message);
  (error as any).statusCode = statusCode; // Use type assertion to add custom properties
  return error;
};

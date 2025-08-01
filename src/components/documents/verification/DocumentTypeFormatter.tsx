/**
 * formatDocumentType
 * @description Function
 */
export const formatDocumentType = (type: string): string => {
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

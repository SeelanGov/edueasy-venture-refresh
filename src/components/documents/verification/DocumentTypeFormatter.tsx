
/**
 * formatDocumentType
 * @description Function
 */
export const formatDocumentType = (type: string): void => {
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

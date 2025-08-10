import { React } from 'react';

interface DocumentUploadHeaderProps {
  title: string;
  description: string;
}

/**
 * DocumentUploadHeader
 * @description Function
 */
export const DocumentUploadHeader: React.FC<DocumentUploadHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
    </div>
  );
};

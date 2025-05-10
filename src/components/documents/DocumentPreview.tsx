
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { FileIcon, FileText, Image, FileWarning } from "lucide-react";

interface DocumentPreviewProps {
  filePath: string;
  fileName?: string;
  fileType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DocumentPreview = ({
  filePath,
  fileName = "Document",
  fileType,
  className = "",
  size = "md"
}: DocumentPreviewProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-40 w-40",
    lg: "h-60 w-60"
  };
  
  const isImage = fileType?.startsWith('image/') || 
    filePath?.endsWith('.jpg') || 
    filePath?.endsWith('.jpeg') || 
    filePath?.endsWith('.png');
  
  const isPdf = fileType === 'application/pdf' || filePath?.endsWith('.pdf');
  
  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('user_documents')
          .createSignedUrl(filePath, 60);
          
        if (error) throw error;
        setUrl(data.signedUrl);
      } catch (err: any) {
        console.error('Error fetching document URL:', err);
        setError(err.message || 'Could not load document preview');
      } finally {
        setLoading(false);
      }
    };
    
    if (filePath) {
      fetchUrl();
    }
    
    return () => {
      // Clean up any resources if needed
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [filePath]);
  
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <Skeleton className={`${sizeClasses[size]} rounded-md bg-gray-200`} />
        <Skeleton className="h-4 w-24 mt-2" />
      </div>
    );
  }
  
  if (error || !url) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center`}>
          <FileWarning className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 mt-2">Preview unavailable</p>
      </div>
    );
  }
  
  if (isImage) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <img 
          src={url} 
          alt={fileName}
          className={`${sizeClasses[size]} object-cover rounded-md border border-gray-300`}
          onError={() => setError('Could not load image')}
        />
        <p className="text-xs text-gray-500 mt-2 truncate max-w-full">
          {fileName}
        </p>
      </div>
    );
  }
  
  if (isPdf) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className={`${sizeClasses[size]} border border-gray-300 rounded-md bg-gray-50 flex flex-col items-center justify-center p-4`}>
          <FileText className="h-10 w-10 text-red-500" />
          <p className="text-xs text-gray-700 mt-2 font-medium">PDF Document</p>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline mt-2"
        >
          View PDF
        </a>
      </div>
    );
  }
  
  // Generic file preview
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizeClasses[size]} border border-gray-300 rounded-md bg-gray-50 flex flex-col items-center justify-center p-4`}>
        <FileIcon className="h-10 w-10 text-gray-500" />
        <p className="text-xs text-gray-700 mt-2 font-medium truncate max-w-full">
          {fileName}
        </p>
      </div>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline mt-2"
      >
        Download File
      </a>
    </div>
  );
};

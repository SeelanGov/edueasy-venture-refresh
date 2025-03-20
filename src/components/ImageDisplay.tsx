
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageDisplayProps {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
}

export const ImageDisplay = ({
  src,
  alt,
  aspectRatio = 16 / 9,
  className = '',
}: ImageDisplayProps) => {
  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <AspectRatio ratio={aspectRatio} className="bg-muted">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-all hover:scale-105 duration-700"
        />
      </AspectRatio>
    </div>
  );
};

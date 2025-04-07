
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageDisplayProps {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  borderRadius?: string;
  hover?: boolean;
}

export const ImageDisplay = ({
  src,
  alt,
  aspectRatio = 16 / 9,
  className = '',
  objectFit = 'cover',
  objectPosition = 'center',
  borderRadius = 'rounded-lg',
  hover = true,
}: ImageDisplayProps) => {
  return (
    <div className={`overflow-hidden ${borderRadius} ${className}`}>
      <AspectRatio ratio={aspectRatio} className="bg-muted">
        <img
          src={src}
          alt={alt}
          className={`h-full w-full ${
            hover ? 'transition-all hover:scale-105 duration-700' : ''
          }`}
          style={{ objectFit, objectPosition }}
        />
      </AspectRatio>
    </div>
  );
};

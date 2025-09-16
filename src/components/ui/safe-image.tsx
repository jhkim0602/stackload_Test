"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  fallbackColor?: string;
}

export function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  fallbackText, 
  fallbackColor = "bg-gray-200" 
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // src가 없거나 이미지 오류가 발생한 경우 폴백 표시
  if (!src || imageError) {
    const displayText = fallbackText || alt.slice(0, 2).toUpperCase();
    
    return (
      <div 
        className={`${fallbackColor} flex items-center justify-center text-white font-semibold ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">{displayText}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          setImageError(true);
        }
      }}
    />
  );
}
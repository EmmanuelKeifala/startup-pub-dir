import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  className?: string;
  coverImage?: string;
  accentColor: string;
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  objectFit?: "cover" | "contain";
}

function StartUpCover({
  className,
  coverImage = "https://placehold.co/1200x800.png",
  logoPosition = "top-left",
  accentColor,
  objectFit = "contain",
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg transition-all duration-300 group w-full aspect-[16/10]", // Changed aspect ratio to be taller
        className
      )}
      style={{
        minHeight: "180px", // Added minimum height
        maxHeight: "220px", // Added maximum height
      }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
        <div className="relative w-full h-full">
          <Image
            src={coverImage}
            alt="Start Up image"
            fill
            className={cn(
              "transition-transform duration-700 group-hover:scale-105",
              objectFit === "contain" && "object-contain p-2", // Reduced padding to make image larger
              objectFit === "cover" && "object-cover"
            )}
            quality={90} // Increased quality slightly
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 z-10 opacity-40"
        style={{
          background: `linear-gradient(45deg, rgba(0, 0, 0, 0.3), transparent, rgba(${parseInt(
            accentColor?.slice(1, 3) || "00",
            16
          )}, ${parseInt(accentColor?.slice(3, 5) || "00", 16)}, ${parseInt(
            accentColor?.slice(5, 7) || "00",
            16
          )}, 0.05))`,
        }}
      />

      <div
        className={cn(
          "absolute z-20 flex items-center justify-center p-4 transition-all duration-300",
          {
            "top-2 left-2": logoPosition === "top-left",
            "top-2 right-2": logoPosition === "top-right",
            "bottom-2 left-2": logoPosition === "bottom-left",
            "bottom-2 right-2": logoPosition === "bottom-right",
          }
        )}
      />

      <div
        className="absolute inset-0 z-20 border border-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-lg"
        style={{
          borderColor: accentColor,
        }}
      />

      <div
        className="absolute inset-0 z-30 opacity-0 transition-opacity duration-500 group-hover:opacity-30"
        style={{
          boxShadow: `0 0 15px ${accentColor} inset`,
        }}
      />
    </div>
  );
}

export default StartUpCover;

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type StartUpCoverVariant =
  | "extraSmall"
  | "small"
  | "medium"
  | "regular"
  | "wide";

const variantStyles: Record<StartUpCoverVariant, string> = {
  extraSmall: "start-up-cover_extra_small",
  small: "start-up-cover_small",
  medium: "start-up-cover_medium",
  regular: "start-up-cover_regular",
  wide: "start-up-cover_wide",
};

interface Props {
  variant: StartUpCoverVariant;
  className?: string;
  coverImage?: string;
  accentColor: string;
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; // Position of the logo
}

function StartUpCover({
  variant = "regular",
  className,
  coverImage = "https://placehold.co/1200x800.png",
  logoPosition = "top-left",
  accentColor,
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg transition-all duration-300 group",
        variantStyles[variant],
        className
      )}
      style={{
        aspectRatio: "16 / 9",
      }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={coverImage}
          alt="Start Up image"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105" // Subtle zoom effect on hover
          quality={100}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive image sizes
        />
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(45deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))", // Light gradient overlay
        }}
      />

      <div
        className={cn(
          "absolute z-20 flex items-center justify-center p-4 transition-all duration-300",
          {
            "top-4 left-4": logoPosition === "top-left",
            "top-4 right-4": logoPosition === "top-right",
            "bottom-4 left-4": logoPosition === "bottom-left",
            "bottom-4 right-4": logoPosition === "bottom-right",
          }
        )}
      />

      <div
        className="absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 40px ${accentColor} inset`,
        }}
      />
    </div>
  );
}

export default StartUpCover;

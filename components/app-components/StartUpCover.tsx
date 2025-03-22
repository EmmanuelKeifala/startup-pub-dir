import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type StartUpCoverVariant =
  | "extraSmall"
  | "small"
  | "medium"
  | "regular"
  | "wide";

// Define specific aspect ratios for each variant
const variantConfig: Record<
  StartUpCoverVariant,
  { className: string; aspectRatio: string }
> = {
  extraSmall: {
    className: "start-up-cover_extra_small max-w-xs",
    aspectRatio: "16 / 9",
  },
  small: {
    className: "start-up-cover_small max-w-sm",
    aspectRatio: "16 / 9",
  },
  medium: {
    className: "start-up-cover_medium max-w-md",
    aspectRatio: "16 / 9",
  },
  regular: {
    className: "start-up-cover_regular max-w-lg",
    aspectRatio: "16 / 9",
  },
  wide: {
    className: "start-up-cover_wide max-w-xl",
    aspectRatio: "16 / 9",
  },
};

interface Props {
  variant: StartUpCoverVariant;
  className?: string;
  coverImage?: string;
  accentColor: string;
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  objectFit?: "cover" | "contain" | "fill";
}

function StartUpCover({
  variant = "regular",
  className,
  coverImage = "https://placehold.co/1200x800.png",
  logoPosition = "top-left",
  accentColor,
  objectFit = "cover",
}: Props) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg transition-all duration-300 group",
        config.className,
        className
      )}
      style={{
        aspectRatio: config.aspectRatio,
      }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
        {/* Image container with specific dimensions */}
        <div className="relative w-full h-full">
          <Image
            src={coverImage}
            alt="Start Up image"
            fill
            className={cn(
              "transition-transform duration-700 group-hover:scale-105",
              objectFit === "cover" && "object-cover",
              objectFit === "contain" && "object-contain p-2"
            )}
            quality={90}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 z-10 opacity-80"
        style={{
          background: `linear-gradient(45deg, rgba(0, 0, 0, 0.6), transparent, rgba(${parseInt(
            accentColor.slice(1, 3),
            16
          )}, ${parseInt(accentColor.slice(3, 5), 16)}, ${parseInt(
            accentColor.slice(5, 7),
            16
          )}, 0.1))`,
        }}
      />

      {/* Logo positioning container */}
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
        className="absolute inset-0 z-20 border-2 border-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-lg"
        style={{
          borderColor: accentColor,
        }}
      />

      <div
        className="absolute inset-0 z-30 opacity-0 transition-opacity duration-500 group-hover:opacity-60"
        style={{
          boxShadow: `0 0 30px ${accentColor} inset`,
        }}
      />
    </div>
  );
}

export default StartUpCover;

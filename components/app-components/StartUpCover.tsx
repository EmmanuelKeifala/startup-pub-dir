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
  primaryColor: string;
  accentColor: string;
  coverImage?: string;
}
function StartUpCover({
  variant = "regular",
  className,
  primaryColor,
  accentColor,
  coverImage = "https://placehold.co/400x600.png",
}: Props) {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      {/* TODO:  have to add an svg wrapper later */}
      <div
        className="absolute z-10"
        style={{
          left: "13%",
          width: "90%",
          height: "89%",
        }}
      >
        <Image
          src={coverImage}
          alt="Start Up image"
          fill
          className=" rounded-sm object-fill"
        />
      </div>
    </div>
  );
}

export default StartUpCover;

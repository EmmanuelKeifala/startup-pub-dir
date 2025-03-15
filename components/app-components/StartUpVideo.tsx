"use client";
import config from "@/lib/config";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import React from "react";

function StartUpVideo({ videoUrl }: { videoUrl: string }) {
  const vidPath = videoUrl.split("https://ik.imagekit.io/startuppubdir")[1];

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-3xl aspect-video">
        <ImageKitProvider urlEndpoint={config.imagekit.urlEndpoint}>
          <IKVideo
            path={vidPath}
            controls={true}
            className="w-full h-full rounded-xl object-cover shadow-lg"
            style={{
              minHeight: "360px",
              maxHeight: "540px",
            }}
          />
        </ImageKitProvider>
      </div>
    </div>
  );
}

export default StartUpVideo;

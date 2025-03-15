"use client";
import config from "@/lib/config";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import React from "react";

function StartUpVideo({ videoUrl }: { videoUrl: string }) {
  return (
    <ImageKitProvider
      publicKey={config.imagekit.publicKey}
      urlEndpoint={config.imagekit.urlEndpoint}
    >
      <IKVideo path={videoUrl} controls={true} className="w-full rounded-xl" />
    </ImageKitProvider>
  );
}

export default StartUpVideo;

"use client";
import config from "@/lib/config";
import {
  IKImage,
  IKVideo,
  ImageKitProvider,
  IKUpload,
  ImageKitContext,
} from "imagekitio-next";
import { toast } from "sonner";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
const { publicKey, urlEndpoint } = config.imagekit;
const authenticator = async () => {
  try {
    const response = await fetch(`${config.apiEndPoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Error authenticating user: ${errorText} ${response.status}`
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return {
      token,
      expire,
      signature,
    };
  } catch (error: any) {
    throw new Error(`Error authenticating user: ${error.message}`);
  }
};

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => {};
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (err: any) => {
    console.log("Error", err);
    toast.error("Error uploading file", {
      description: err.message,
    });
  };

  const onSuccess = (res: any) => {
    console.log("Success", res);
    setFile(res);
    onFileChange(res.filePath);
    toast.success("File uploaded successfully");
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="image" // TODO:  change this to be dynamic
      />

      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click(); // TODO:  fix this type issue later
          }
        }}
      >
        <Upload size={40} className="object-contain" />
        <p className="text-base text-light-100">Upload a file</p>

        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
          urlEndpoint={urlEndpoint}
          path={file.filePath}
          width={500}
          height={500}
          alt="uploaded file"
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;

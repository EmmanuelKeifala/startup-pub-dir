"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import config from "@/lib/config";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, File } from "lucide-react";

const {
  imagekit: { publicKey, urlEndpoint },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.apiEndPoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{
    filePath: string | null;
    url: string | null;
  }>({
    filePath: value ?? null,
    url: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  // Enhanced styles with better visual feedback
  const styles = {
    button: cn(
      "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer hover:opacity-80 relative w-full h-full",
      variant === "dark"
        ? "bg-dark-300 border-gray-600 hover:border-gray-400"
        : "bg-light-600 border-gray-300 hover:border-gray-400"
    ),
    placeholder: cn(
      "text-base font-medium mt-2",
      variant === "dark" ? "text-light-100" : "text-slate-500"
    ),
    text: cn(
      "text-sm mt-1 max-w-full truncate",
      variant === "dark" ? "text-light-100/70" : "text-dark-400"
    ),
    icon: cn("mb-1", variant === "dark" ? "text-light-100" : "text-slate-500"),
    progressBar:
      "rounded-full bg-green-800 p-0.5 text-center font-bebas-neue text-[8px] font-bold leading-none text-light-100;",
    progressContainer: "w-full h-2 rounded-full bg-gray-200 mt-3",
  };

  const onError = (error: any) => {
    console.log(error);
    toast.error(`${type} upload failed`, {
      description: `Your ${type} could not be uploaded. Please try again.`,
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.url);

    toast.success(`${type} uploaded successfully`, {
      description: `File uploaded successfully!`,
    });
  };

  const onValidate = (file: File) => {
    const sizeLimit = type === "image" ? 20 : 50; // MB
    if (file.size > sizeLimit * 1024 * 1024) {
      toast.error("File size too large", {
        description: `Please upload a file that is less than ${sizeLimit}MB in size`,
      });
      return false;
    }
    return true;
  };

  // Get filename from path
  const getFileName = (path: string) => {
    if (!path) return "";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <div className="w-full h-full flex flex-col">
        <button
          className={styles.button}
          onClick={(e) => {
            e.preventDefault();
            if (ikUploadRef.current) {
              // @ts-ignore
              ikUploadRef.current?.click();
            }
          }}
        >
          {!file?.filePath ? (
            <>
              {type === "image" ? (
                <ImageIcon size={24} className={styles.icon} />
              ) : (
                <File size={24} className={styles.icon} />
              )}
              <p className={styles.placeholder}>{placeholder}</p>
              <p className="text-xs opacity-70">
                Click to select a {type === "image" ? "an image" : "a video"}{" "}
                file
              </p>
            </>
          ) : (
            <>
              <Upload size={20} className={styles.icon} />
              <p className={styles.placeholder}>
                {file?.filePath ? "Replace file" : placeholder}
              </p>
              {file?.filePath && (
                <p className={styles.text} title={file.filePath}>
                  {getFileName(file.filePath)}
                </p>
              )}
            </>
          )}

          {/* Progress bar */}
          {progress > 0 && progress < 100 && (
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </button>

        {file?.filePath && (
          <div className="mt-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {type === "image" ? (
              <IKImage
                alt={file.filePath as string}
                path={file.filePath as string}
                height={200}
                width={300}
                transformation={[
                  {
                    cropMode: "preserve_ratio",
                  },
                ]}
                loading="lazy"
                lqip={{ active: true }}
                className="object-contain w-full h-full max-h-48"
              />
            ) : type === "video" ? (
              <IKVideo
                path={file.filePath as string}
                controls={true}
                className="w-full h-48 object-contain"
              />
            ) : null}
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
};

export default FileUpload;

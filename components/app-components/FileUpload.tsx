"use client";
type UploadError = {
  message: string;
};
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import config from "@/lib/config";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, File, Loader2 } from "lucide-react";

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
  } catch (error: unknown) {
    throw new Error(
      `Authentication request failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

interface FileUploadResponse {
  filePath: string;
  url: string;
}

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
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{
    filePath: string | null;
    url: string | null;
  }>({
    filePath: value ?? null,
    url: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<UploadError | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Enhanced styles with better visual feedback
  const styles = {
    button: cn(
      "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-all relative w-full h-full",
      isUploading ? "opacity-70" : "hover:opacity-80 cursor-pointer",
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
    progressBar: cn(
      "h-full rounded-full transition-all",
      variant === "dark" ? "bg-green-600" : "bg-green-500"
    ),
    progressContainer: "w-full h-2 rounded-full bg-gray-200 mt-3",
    progressText: cn(
      "text-xs mt-1",
      variant === "dark" ? "text-light-100/70" : "text-dark-400"
    ),
    errorButton: cn(
      "mt-2 px-3 py-1 text-sm rounded-md",
      variant === "dark"
        ? "bg-red-600 hover:bg-red-700 text-white"
        : "bg-red-100 hover:bg-red-200 text-red-800"
    ),
  };

  const onError = (error: UploadError) => {
    console.error(error);
    setIsUploading(false);
    setProgress(0);
    setUploadError(error);
    toast.error(`${type} upload failed`, {
      description: `Your ${type} could not be uploaded. Please try again. ${error.message}`,
      action: {
        label: "Retry",
        onClick: () => {
          if (selectedFile) {
            handleRetryUpload();
          }
        },
      },
    });
  };

  const onSuccess = (res: FileUploadResponse) => {
    setFile(res);
    onFileChange(res.url);
    setIsUploading(false);
    setProgress(100);
    setUploadError(null);
    setSelectedFile(null);

    setTimeout(() => {
      setProgress(0);
    }, 1500);

    toast.success(`${type} uploaded successfully`, {
      description: `File uploaded successfully!`,
    });
  };

  const onValidate = (file: File) => {
    setSelectedFile(file);
    const sizeLimit = type === "image" ? 20 : 50; // MB
    if (file.size > sizeLimit * 1024 * 1024) {
      toast.error("File size too large", {
        description: `Please upload a file that is less than ${sizeLimit}MB in size`,
      });
      return false;
    }
    return true;
  };

  const handleRetryUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);
    setUploadError(null);

    // Trigger the upload again
    if (ikUploadRef.current) {
      // Create a new DataTransfer object to simulate file selection
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      ikUploadRef.current.files = dataTransfer.files;

      // Trigger the change event to start upload
      const event = new Event("change", { bubbles: true });
      ikUploadRef.current.dispatchEvent(event);
    }
  };

  // Get filename from path
  const getFileName = (path: string) => {
    if (!path) return "";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setProgress(0);
    setUploadError(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isUploading && ikUploadRef.current) {
      ikUploadRef.current.click();
    }
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
        onUploadStart={handleUploadStart}
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
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 size={24} className={`${styles.icon} animate-spin`} />
              <p className={styles.placeholder}>Uploading...</p>
              <p className={styles.progressText}>{progress}% complete</p>
            </>
          ) : !file?.filePath ? (
            <>
              {type === "image" ? (
                <ImageIcon size={24} className={styles.icon} />
              ) : (
                <File size={24} className={styles.icon} />
              )}
              <p className={styles.placeholder}>{placeholder}</p>
              <p className="text-xs opacity-70">
                Click to select {type === "image" ? "an image" : "a video"} file
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

          {/* Progress bar - always show during upload */}
          {isUploading && (
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </button>

        {uploadError && !isUploading && (
          <div className="mt-2 text-center">
            <button onClick={handleRetryUpload} className={styles.errorButton}>
              Retry Upload
            </button>
          </div>
        )}

        {file?.filePath && !isUploading && (
          <div className="mt-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {type === "image" ? (
              <IKImage
                alt={file.filePath}
                path={file.filePath}
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
                path={file.filePath}
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

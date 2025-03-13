import config from "@/lib/config";
import {
  IKImage,
  IKVideo,
  ImageKitProvider,
  IKUpload,
  ImageKitContext,
} from "imagekitio-next";

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

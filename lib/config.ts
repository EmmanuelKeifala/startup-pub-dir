const config = {
  apiEndPoint: process.env.NEXT_PUBLIC_API_ENDPOINT ?? "",
  databaseUrl:
    "postgresql://neondb_owner:npg_Wx5sitgvRwz3@ep-lingering-morning-a9kcegtd-pooler.gwc.azure.neon.tech/neondb?sslmode=require",
  imagekit: {
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "",
    privatekey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "",
  },
};

export default config;

import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const { privatekey, publicKey, urlEndpoint } = config.imagekit;
const imagekit = new ImageKit({
  publicKey,
  privateKey: privatekey,
  urlEndpoint,
});

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}

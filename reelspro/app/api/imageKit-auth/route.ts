import ImageKit from "imagekit";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {
    try {
        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json(authParams);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get authentication parameters" },
            { status: 500 }
        );
    }

}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json(
            { error: "Query parameter 'q' is required" },
            { status: 400 }
        );
    }

    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "SERPAPI_KEY not configured" },
            { status: 500 }
        );
    }

    try {
        // Search for images using SerpAPI Google Images
        const serpApiUrl = new URL("https://serpapi.com/search.json");
        serpApiUrl.searchParams.set("api_key", apiKey);
        serpApiUrl.searchParams.set("engine", "google_images");
        serpApiUrl.searchParams.set("q", `${query} hair care treatment`);
        serpApiUrl.searchParams.set("num", "12");
        serpApiUrl.searchParams.set("safe", "active");
        serpApiUrl.searchParams.set("ijn", "0");

        const response = await fetch(serpApiUrl.toString());

        if (!response.ok) {
            throw new Error(`SerpAPI responded with ${response.status}`);
        }

        const data = await response.json();

        // Extract relevant image data
        const images = (data.images_results || []).slice(0, 12).map((img: {
            original: string;
            thumbnail: string;
            title: string;
            source: string;
        }) => ({
            url: img.original,
            thumbnail: img.thumbnail,
            title: img.title,
            source: img.source,
        }));

        return NextResponse.json({ images });
    } catch (error) {
        console.error("SerpAPI error:", error);
        return NextResponse.json(
            { error: "Failed to search images" },
            { status: 500 }
        );
    }
}

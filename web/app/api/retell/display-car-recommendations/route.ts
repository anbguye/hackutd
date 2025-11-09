import { NextResponse } from "next/server";
import { Retell } from "retell-sdk";
import { displayCarRecommendationsInputSchema } from "@/lib/cars/schemas";

export async function POST(req: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-retell-signature") || "";

    // Verify signature
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      console.error("[retell/display-car-recommendations] RETELL_API_KEY not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!Retell.verify(rawBody, retellApiKey, signature)) {
      console.error("[retell/display-car-recommendations] Invalid signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    let body: { name?: string; call?: unknown; args?: unknown };
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      console.error("[retell/display-car-recommendations] Invalid JSON:", error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Extract args from Retell format (body.args) or use body directly as fallback
    const args = body.args || body;

    // Validate input using zod schema
    const validationResult = displayCarRecommendationsInputSchema.safeParse(args);
    if (!validationResult.success) {
      console.error(
        "[retell/display-car-recommendations] Validation error:",
        validationResult.error
      );
      return NextResponse.json(
        { error: "Invalid parameters", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Validate items array
    if (
      !validationResult.data.items ||
      !Array.isArray(validationResult.data.items) ||
      validationResult.data.items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Items array is required and must contain at least one car object from searchToyotaTrims results.",
          items: [],
          count: 0,
        },
        { status: 400 }
      );
    }

    // Slice to max 3 items
    const items = validationResult.data.items.slice(0, 3);

    // Return result (Retell expects 200-299 status codes)
    return NextResponse.json(
      {
        items,
        count: items.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[retell/display-car-recommendations] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


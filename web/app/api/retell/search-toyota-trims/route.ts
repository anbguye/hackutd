import { NextResponse } from "next/server";
import { Retell } from "retell-sdk";
import { searchToyotaTrims } from "@/lib/cars/searchToyotaTrims";
import { searchToyotaTrimsInputSchema } from "@/lib/cars/schemas";

export async function POST(req: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-retell-signature") || "";

    // Verify signature
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      console.error("[retell/search-toyota-trims] RETELL_API_KEY not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!Retell.verify(rawBody, retellApiKey, signature)) {
      console.error("[retell/search-toyota-trims] Invalid signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    let body: { name?: string; call?: unknown; args?: unknown };
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      console.error("[retell/search-toyota-trims] Invalid JSON:", error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Extract args from Retell format (body.args) or use body directly as fallback
    const args = body.args || body;

    // Validate input using zod schema
    const validationResult = searchToyotaTrimsInputSchema.safeParse(args);
    if (!validationResult.success) {
      console.error(
        "[retell/search-toyota-trims] Validation error:",
        validationResult.error
      );
      return NextResponse.json(
        { error: "Invalid parameters", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Execute search
    const result = await searchToyotaTrims(validationResult.data);

    // Return result (Retell expects 200-299 status codes)
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[retell/search-toyota-trims] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { Retell } from "retell-sdk";
import { scheduleTestDriveInputSchema } from "@/lib/cars/schemas";
import { scheduleTestDrive } from "@/lib/bookings/scheduleTestDrive";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-retell-signature") || "";

    // Verify signature
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      console.error("[retell/schedule-test-drive] RETELL_API_KEY not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!Retell.verify(rawBody, retellApiKey, signature)) {
      console.error("[retell/schedule-test-drive] Invalid signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    let body: { name?: string; call?: unknown; args?: unknown };
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      console.error("[retell/schedule-test-drive] Invalid JSON:", error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Extract args from Retell format (body.args) or use body directly as fallback
    const args = body.args || body;

    // Validate input using zod schema
    const validationResult = scheduleTestDriveInputSchema.safeParse(args);
    if (!validationResult.success) {
      console.error(
        "[retell/schedule-test-drive] Validation error:",
        validationResult.error
      );
      return NextResponse.json(
        { error: "Invalid parameters", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // For Retell calls, we need to handle user authentication differently
    // Retell calls don't have user sessions, so we need to find or create a user
    // based on the contact information provided during the call
    
    const input = validationResult.data;
    const supabase = createSupabaseServerClient();
    let userContext = null;
    
    // Try to find existing user by email
    if (input.contactEmail) {
      try {
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (!listError && users) {
          const existingUser = users.find((u) => u.email === input.contactEmail);
          
          if (existingUser) {
            userContext = {
              id: existingUser.id,
              email: existingUser.email,
              user_metadata: existingUser.user_metadata || {},
            };
            console.log("[retell/schedule-test-drive] Found existing user:", existingUser.id);
          }
        }
      } catch (error) {
        console.error("[retell/schedule-test-drive] Error finding user:", error);
      }
    }
    
    // If no user found and we have email, create a guest user account
    if (!userContext && input.contactEmail) {
      try {
        // Generate a random password (user won't need to log in)
        const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + "!A1";
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: input.contactEmail,
          password: randomPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: input.contactName || input.contactEmail.split("@")[0],
            phone: input.contactPhone || "",
            source: "retell_voice_call",
          },
        });
        
        if (newUser?.user && !createError) {
          userContext = {
            id: newUser.user.id,
            email: newUser.user.email,
            user_metadata: newUser.user.user_metadata || {},
          };
          console.log("[retell/schedule-test-drive] Created guest user:", newUser.user.id);
        } else {
          console.error("[retell/schedule-test-drive] Error creating user:", createError);
        }
      } catch (error) {
        console.error("[retell/schedule-test-drive] Error creating guest user:", error);
      }
    }

    // Call the shared service
    const result = await scheduleTestDrive(input, userContext);

    // Return result (Retell expects 200-299 status codes)
    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          bookingId: result.bookingId,
          link: result.link,
          details: result.details,
        },
        { status: 200 }
      );
    } else {
      // Return error but with 200 status (Retell requirement)
      // Include error details so Retell can communicate to user
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          link: result.link,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[retell/schedule-test-drive] Unexpected error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 200 } // Return 200 even on error per Retell requirements
    );
  }
}


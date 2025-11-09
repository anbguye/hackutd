import { scheduleTestDriveInputSchema } from "@/lib/cars/schemas";
import { sendBookingConfirmationEmail } from "@/lib/email/booking-confirmation";
import { createSsrClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { z } from "zod";

type ScheduleTestDriveInput = z.infer<typeof scheduleTestDriveInputSchema>;

export interface ScheduleTestDriveResult {
  success: boolean;
  message?: string;
  bookingId?: string;
  link?: string;
  details?: {
    date: string;
    time: string;
    location: string;
    vehicle: string;
  };
  error?: string;
}

interface UserContext {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

/**
 * Parse and normalize date/time from user input
 */
function parseBookingDateTime(preferredDate: string, preferredTime?: string): Date {
  const now = new Date();
  let bookingDateTime: Date;

  // Handle relative dates
  const dateLower = preferredDate.toLowerCase();
  if (dateLower.includes("tomorrow")) {
    bookingDateTime = new Date(now);
    bookingDateTime.setDate(bookingDateTime.getDate() + 1);
  } else if (dateLower.includes("next week")) {
    bookingDateTime = new Date(now);
    bookingDateTime.setDate(bookingDateTime.getDate() + 7);
  } else {
    // Try to parse ISO date
    bookingDateTime = new Date(preferredDate);
    if (isNaN(bookingDateTime.getTime())) {
      // Default to tomorrow if parsing fails
      bookingDateTime = new Date(now);
      bookingDateTime.setDate(bookingDateTime.getDate() + 1);
    }
  }

  // Set time
  if (preferredTime) {
    if (preferredTime.includes(":")) {
      // HH:MM format
      const [hours, minutes] = preferredTime.split(":").map(Number);
      bookingDateTime.setHours(hours || 10, minutes || 0, 0, 0);
    } else {
      const timeLower = preferredTime.toLowerCase();
      if (timeLower.includes("morning")) {
        bookingDateTime.setHours(10, 0, 0, 0);
      } else if (timeLower.includes("afternoon")) {
        bookingDateTime.setHours(14, 0, 0, 0);
      } else if (timeLower.includes("evening")) {
        bookingDateTime.setHours(17, 0, 0, 0);
      } else {
        bookingDateTime.setHours(10, 0, 0, 0); // Default to 10 AM
      }
    }
  } else {
    bookingDateTime.setHours(10, 0, 0, 0); // Default to 10 AM
  }

  return bookingDateTime;
}

/**
 * Get user profile data for contact information
 */
async function getUserContactInfo(
  supabase: Awaited<ReturnType<typeof createSsrClient>>,
  userId: string,
  input: ScheduleTestDriveInput,
  userContext?: UserContext | null
): Promise<{ name: string; email: string; phone: string }> {
  // Get user profile for contact info
  const { data: profileData } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // Get user from auth or use provided context
  let user = userContext;
  if (!user) {
    const { data: { user: fetchedUser } } = await supabase.auth.getUser();
    user = fetchedUser || null;
  }

  const contactName =
    input.contactName ||
    user?.user_metadata?.full_name ||
    profileData?.contact_name ||
    user?.email?.split("@")[0] ||
    "Customer";

  const contactEmail = input.contactEmail || user?.email || "";

  const contactPhone =
    input.contactPhone ||
    user?.user_metadata?.phone ||
    profileData?.contact_phone ||
    "";

  return {
    name: contactName,
    email: contactEmail,
    phone: contactPhone,
  };
}

/**
 * Shared service function to schedule a test drive
 * Can be used by both the chat tool and Retell API endpoint
 */
export async function scheduleTestDrive(
  input: ScheduleTestDriveInput,
  userContext?: UserContext | null
): Promise<ScheduleTestDriveResult> {
  console.log("[scheduleTestDrive] Service called with:", JSON.stringify(input, null, 2));

  try {
    // Get Supabase client
    const supabase = await createSsrClient();

    // Get user context if not provided
    let currentUser: UserContext | null = userContext || null;

    if (!currentUser) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[scheduleTestDrive] Session error:", sessionError);
      }

      currentUser = session?.user || null;

      if (!currentUser) {
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("[scheduleTestDrive] User fetch error:", userError);
        }
        currentUser = fetchedUser || null;
      }
    }

    if (!currentUser) {
      console.error("[scheduleTestDrive] No user found");
      return {
        success: false,
        error:
          "Please sign in to schedule a test drive. Your session may have expired - please refresh the page and try again.",
        link: "/login",
      };
    }

    console.log("[scheduleTestDrive] User authenticated:", currentUser.id, "Email:", currentUser.email);

    // Parse date/time
    const bookingDateTime = parseBookingDateTime(input.preferredDate, input.preferredTime);

    // Get vehicle details
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("toyota_trim_specs")
      .select("trim_id, model_year, make, model, trim")
      .eq("trim_id", input.trimId)
      .maybeSingle();

    if (vehicleError || !vehicleData) {
      return {
        success: false,
        error: "Vehicle not found. Please select a valid vehicle.",
      };
    }

    // Get user contact info
    const { name: contactName, email: contactEmail, phone: contactPhone } = await getUserContactInfo(
      supabase,
      currentUser.id,
      input,
      currentUser
    );

    if (!contactEmail) {
      return {
        success: false,
        error: "Email address is required. Please update your profile or provide an email.",
      };
    }

    // Insert booking directly into database
    const baseInsert = {
      user_id: currentUser.id,
      car_id: vehicleData.trim_id,
      preferred_location: input.location || "downtown",
      booking_date: bookingDateTime.toISOString(),
      status: "pending" as const,
    };

    const extendedInsert = {
      ...baseInsert,
      vehicle_make: vehicleData.make ?? null,
      vehicle_model: vehicleData.model ?? null,
      vehicle_year: typeof vehicleData.model_year === "number" ? vehicleData.model_year : null,
      vehicle_trim: vehicleData.trim ?? null,
    };

    const { data: booking, error: insertError } = await supabase
      .from("test_drive_bookings")
      .insert(extendedInsert)
      .select("*")
      .single();

    if (insertError) {
      console.error("[scheduleTestDrive] Database insert error:", insertError);
      // Try fallback insert
      const { data: fallbackBooking, error: fallbackError } = await supabase
        .from("test_drive_bookings")
        .insert(baseInsert)
        .select("*")
        .single();

      if (fallbackError) {
        return {
          success: false,
          error: "Failed to create booking. Please try again later.",
        };
      }

      // Send email for fallback booking
      try {
        await sendBookingConfirmationEmail({
          contactName,
          contactEmail,
          contactPhone: contactPhone || "000-000-0000",
          preferredLocation: input.location || "downtown",
          bookingDateTime: bookingDateTime.toISOString(),
          vehicleMake: vehicleData.make || "Vehicle",
          vehicleModel: vehicleData.model || "Model",
          vehicleYear: vehicleData.model_year || new Date().getFullYear(),
          vehicleTrim: vehicleData.trim || "Trim",
        });
      } catch (emailError) {
        console.error("[scheduleTestDrive] Email error:", emailError);
      }

      return {
        success: true,
        message: `Test drive scheduled successfully for ${bookingDateTime.toLocaleDateString()} at ${bookingDateTime.toLocaleTimeString()}`,
        bookingId: fallbackBooking?.id,
        link: `/test-drive?trim_id=${input.trimId}&year=${vehicleData.model_year}&make=${vehicleData.make}&model=${vehicleData.model}&trim=${vehicleData.trim}`,
        details: {
          date: bookingDateTime.toLocaleDateString(),
          time: bookingDateTime.toLocaleTimeString(),
          location: input.location || "downtown",
          vehicle: `${vehicleData.model_year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim}`,
        },
      };
    }

    // Send confirmation email for successful booking
    try {
      await sendBookingConfirmationEmail({
        contactName,
        contactEmail,
        contactPhone: contactPhone || "000-000-0000",
        preferredLocation: input.location || "downtown",
        bookingDateTime: bookingDateTime.toISOString(),
        vehicleMake: vehicleData.make || "Vehicle",
        vehicleModel: vehicleData.model || "Model",
        vehicleYear: vehicleData.model_year || new Date().getFullYear(),
        vehicleTrim: vehicleData.trim || "Trim",
      });
    } catch (emailError) {
      console.error("[scheduleTestDrive] Email error:", emailError);
      // Don't fail the booking if email fails
    }

    return {
      success: true,
      message: `Test drive scheduled successfully for ${bookingDateTime.toLocaleDateString()} at ${bookingDateTime.toLocaleTimeString()}`,
      bookingId: booking?.id,
      link: `/test-drive?trim_id=${input.trimId}&year=${vehicleData.model_year}&make=${vehicleData.make}&model=${vehicleData.model}&trim=${vehicleData.trim}`,
      details: {
        date: bookingDateTime.toLocaleDateString(),
        time: bookingDateTime.toLocaleTimeString(),
        location: input.location || "downtown",
        vehicle: `${vehicleData.model_year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim}`,
      },
    };
  } catch (error) {
    console.error("[scheduleTestDrive] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred while scheduling test drive",
    };
  }
}


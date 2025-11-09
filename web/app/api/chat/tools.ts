import { tool, type ToolSet, type InferUITools } from "ai";
import { z } from "zod";
import { searchToyotaTrims } from "@/lib/cars/searchToyotaTrims";
import {
  searchToyotaTrimsInputSchema,
  displayCarRecommendationsInputSchema,
  scheduleTestDriveInputSchema,
} from "@/lib/cars/schemas";
import type { CarCard } from "@/lib/cars/types";
import { sendEmailHtmlInputSchema } from "@/lib/email/schemas";
import { sendEmailHtml } from "@/lib/email/resend";
import { createSsrClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { scheduleTestDrive } from "@/lib/bookings/scheduleTestDrive";

const searchToyotaTrimsTool = tool({
  description:
    "Search Toyota's database for vehicles matching the user's criteria. Use this to find cars by budget, type, seats, powertrain, or other specifications. Returns up to 24 results. Call this BEFORE making any claims about vehicle availability, pricing, or features.",
  inputSchema: searchToyotaTrimsInputSchema,
  execute: async (input) => {
    console.log("[searchToyotaTrims] Tool called with:", JSON.stringify(input, null, 2));
    const result = await searchToyotaTrims(input);
    console.log("[searchToyotaTrims] Tool returned:", result.count, "items");
    return result;
  },
});

const displayCarRecommendationsTool = tool({
  description:
    "Display car recommendations as visual cards. Use this after finding vehicles that match the user's criteria. Pass 1-3 car objects from your search results. The items parameter must be an array of car objects.",
  inputSchema: displayCarRecommendationsInputSchema,
  execute: async (input) => {
    if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
      return {
        error: "Items array is required and must contain at least one car object from searchToyotaTrims results.",
        items: [],
        count: 0,
      };
    }

    const items = input.items.slice(0, 3);
    return {
      items,
      count: items.length,
    };
  },
});

const PLACEHOLDER_EMAILS = new Set([
  "user@example.com",
  "example@example.com",
  "test@example.com",
  "placeholder@example.com",
]);

function isPlaceholderEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (PLACEHOLDER_EMAILS.has(normalized)) {
    return true;
  }
  if (normalized.endsWith("@example.com") || normalized.includes("placeholder")) {
    return true;
  }
  return false;
}

function dedupeEmails(emails: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const email of emails) {
    const normalized = email.toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(email);
    }
  }
  return result;
}

function resolveRecipients(to: string | string[], userEmail?: string | null) {
  let recipients = (Array.isArray(to) ? to : [to])
    .map((email) => email?.trim())
    .filter((email): email is string => Boolean(email));

  let usedFallback = false;

  if (userEmail) {
    recipients = recipients.map((email) => {
      if (isPlaceholderEmail(email)) {
        usedFallback = true;
        return userEmail;
      }
      return email;
    });
  }

  recipients = dedupeEmails(recipients);

  if (recipients.length > 0 && !userEmail) {
    const hasNonPlaceholder = recipients.some((email) => !isPlaceholderEmail(email));
    if (!hasNonPlaceholder) {
      recipients = [];
    }
  }

  if (recipients.length === 0 && userEmail) {
    recipients = [userEmail];
    usedFallback = true;
  }

  return { recipients, usedFallback };
}

function createSendEmailHtmlTool(user: { id: string; email?: string | null } | null) {
  return tool({
    description:
      "Send an email with raw HTML content via Resend. Use this tool PROACTIVELY after providing car recommendations or when the user shows interest in vehicles. Always include: (1) Car recommendations with images and links, (2) Financing options (monthly payments, loan terms) calculated using estimateFinance tool, (3) Leasing options (monthly lease payments), (4) Personalization based on conversation context. Use when the user explicitly requests or agrees to your proactive suggestion. Provide the recipient email address(es), subject line, and HTML content.",
    inputSchema: sendEmailHtmlInputSchema,
    execute: async (input) => {
      const startTime = Date.now();
      const htmlPreview = input.html.length > 200 ? input.html.substring(0, 200) + "..." : input.html;

      const { recipients, usedFallback } = resolveRecipients(input.to, user?.email);

      if (recipients.length === 0) {
        return {
          success: false,
          error: "No valid recipient email provided. Please provide an email address to send the summary.",
        };
      }

      const finalTo = Array.isArray(input.to) ? recipients : recipients[0];
      const finalInput = {
        ...input,
        to: finalTo,
      };

      console.log(
        "[sendEmailHtml] Tool called with:",
        JSON.stringify(
          {
            to: finalInput.to,
            subject: finalInput.subject,
            htmlLength: finalInput.html.length,
            htmlPreview,
            usedFallback,
          },
          null,
          2,
        ),
      );

      try {
        // Add timeout handling (30 seconds max)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Email sending timed out after 30 seconds"));
          }, 30000);
        });

        const emailPromise = sendEmailHtml(finalInput);
        const result = await Promise.race([emailPromise, timeoutPromise]);

        const duration = Date.now() - startTime;
        console.log(`[sendEmailHtml] Email sent successfully in ${duration}ms:`, result?.id, "to", finalInput.to);

        return {
          success: true,
          id: result?.id,
          to: finalInput.to,
          subject: finalInput.subject,
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorDetails =
          error instanceof Error
            ? {
                message: error.message,
                name: error.name,
                stack: error.stack?.substring(0, 500),
              }
            : { message: String(error) };

        console.error(`[sendEmailHtml] Error sending email after ${duration}ms:`, {
          ...errorDetails,
          to: finalInput.to,
        });

        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        // Provide more helpful error messages
        if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
          return {
            success: false,
            error: "Email sending timed out. Please try again or check your internet connection.",
          };
        }

        if (errorMessage.includes("RESEND_API_KEY") || errorMessage.includes("not configured")) {
          return {
            success: false,
            error: "Email service is not configured. Please contact support.",
          };
        }

        // Check for network errors
        if (errorMessage.includes("fetch") || errorMessage.includes("network") || errorMessage.includes("ECONNREFUSED")) {
          return {
            success: false,
            error: "Network error while sending email. Please check your connection and try again.",
          };
        }

        return {
          success: false,
          error: errorMessage.length > 200 ? errorMessage.substring(0, 200) + "..." : errorMessage,
        };
      }
    },
  });
}

const estimateFinanceTool = tool({
  description:
    "Calculate finance options (loan and lease) for a vehicle. Use this when the user asks about monthly payments, financing, or lease options. Provide the vehicle price (MSRP) in dollars.",
  inputSchema: z.object({
    vehiclePrice: z.number().min(0).describe("The vehicle price (MSRP) in dollars"),
    downPaymentPercent: z.number().min(0).max(100).optional().default(10).describe("Down payment percentage (default 10%)"),
    loanTermMonths: z.number().int().min(36).max(84).optional().describe("Loan term in months (36, 60, or 72)"),
  }),
  execute: async (input) => {
    const { vehiclePrice, downPaymentPercent = 10, loanTermMonths = 60 } = input;
    const downPayment = Math.round(vehiclePrice * (downPaymentPercent / 100));
    const loanAmount = vehiclePrice - downPayment;

    // Simple finance calculation with estimated interest rates
    const interestRates: Record<number, number> = {
      36: 0.05, // 5% for 36 months
      60: 0.08, // 8% for 60 months
      72: 0.10, // 10% for 72 months
    };

    const rate = interestRates[loanTermMonths] || 0.08;
    const totalWithInterest = Math.round(loanAmount * (1 + rate));
    const monthlyPayment = Math.round(totalWithInterest / loanTermMonths);

    // Lease estimate (typically 1.2% of MSRP per month for 36 months)
    const leaseMonthly = Math.round(vehiclePrice * 0.012);
    const leaseDownPayment = Math.round(vehiclePrice * 0.05); // 5% down for lease
    const leaseTotal = leaseMonthly * 36;

    return {
      vehiclePrice,
      downPayment,
      loanAmount,
      loanTermMonths,
      monthlyPayment,
      totalWithInterest,
      lease: {
        monthlyPayment: leaseMonthly,
        downPayment: leaseDownPayment,
        termMonths: 36,
        totalCost: leaseTotal,
      },
      note: "These are estimates. Actual rates depend on credit score, dealer offers, and current market conditions.",
    };
  },
});

const scheduleTestDriveTool = tool({
  description:
    "Schedule a test drive for a vehicle. Use this when the user wants to schedule a test drive or shows interest in test driving a specific vehicle. You should proactively suggest scheduling test drives after showing vehicle recommendations. Requires trim_id, preferred date/time, and optionally location and contact info.",
  inputSchema: scheduleTestDriveInputSchema,
  execute: async (input) => {
    return await scheduleTestDrive(input);
  },
});

// Create scheduleTestDrive tool with user context closure
function createScheduleTestDriveTool(user: { id: string; email?: string | null } | null, session: { access_token: string } | null) {
  return tool({
    description:
      "Schedule a test drive for a vehicle. Use this when the user wants to schedule a test drive or shows interest in test driving a specific vehicle. You should proactively suggest scheduling test drives after showing vehicle recommendations. Requires trim_id, preferred date/time, and optionally location and contact info.",
    inputSchema: scheduleTestDriveInputSchema,
    execute: async (input) => {
      // Pass user context if available
      const userContext = user
        ? {
            id: user.id,
            email: user.email,
            user_metadata: {},
          }
        : null;
      return await scheduleTestDrive(input, userContext);
    },
  });
}

export const tools = {
  searchToyotaTrims: searchToyotaTrimsTool,
  displayCarRecommendations: displayCarRecommendationsTool,
  sendEmailHtml: createSendEmailHtmlTool(null),
  estimateFinance: estimateFinanceTool,
  scheduleTestDrive: scheduleTestDriveTool,
} satisfies ToolSet;

// Create tools with user context for route handler
export function createToolsWithUserContext(user: { id: string; email?: string | null } | null, session: { access_token: string } | null) {
  return {
    searchToyotaTrims: searchToyotaTrimsTool,
    displayCarRecommendations: displayCarRecommendationsTool,
    sendEmailHtml: createSendEmailHtmlTool(user),
    estimateFinance: estimateFinanceTool,
    scheduleTestDrive: createScheduleTestDriveTool(user, session),
  } satisfies ToolSet;
}

export type ChatTools = InferUITools<typeof tools>;

// Re-export CarCard type for backward compatibility
export type { CarCard } from "@/lib/cars/types";


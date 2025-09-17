import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be valid"),
  grade: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  utm: z.record(z.string()).optional()
});

const SUPABASE_EDGE_URL = process.env.NEXT_PUBLIC_SUPABASE_EDGE_URL;
const SUPABASE_EDGE_SECRET = process.env.SUPABASE_EDGE_SECRET;

if (!SUPABASE_EDGE_URL || !SUPABASE_EDGE_SECRET) {
  throw new Error("Missing Supabase environment variables");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = leadSchema.parse(body);
    
    // Add request metadata
    const enrichedData = {
      ...validatedData,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent'),
      source: 'landing',
    };
    
    // Forward to Supabase Edge Function
    const response = await fetch(`${SUPABASE_EDGE_URL}/lead-intake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_EDGE_SECRET}`,
      },
      body: JSON.stringify(enrichedData),
      cache: "no-store",
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.error || 'Failed to submit lead' }, 
        { status: response.status }
      );
    }
    
    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";

export async function GET() {
  // Return empty array just like json-server did
  return NextResponse.json([]);
}

// 2. Handle ADDING to the cart (The missing piece!)
export async function POST() {
  // Pretend we saved it successfully so the frontend doesn't crash
  return NextResponse.json({ success: true });
}
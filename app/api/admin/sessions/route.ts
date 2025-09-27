import { NextRequest, NextResponse } from "next/server";
import { getRecentSessions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getRecentSessions(limit);

    if (result.success && result.sessions) {
      return NextResponse.json(result.sessions, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error || "Error al obtener sesiones" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in sessions API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

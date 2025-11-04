import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session-server";

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error in API me:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

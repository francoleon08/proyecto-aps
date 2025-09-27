import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user) {
      return NextResponse.json(
        { error: "Datos de usuario requeridos" },
        { status: 400 }
      );
    }

    createSession(user);

    return NextResponse.json(
      { message: "Sesión creada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API session:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

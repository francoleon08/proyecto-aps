import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { createSession } from "@/lib/session-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await loginUser({ email, password }, ipAddress, userAgent);

    if (result.success && result.user) {
      createSession(result.user);

      return NextResponse.json(
        {
          message: "Login exitoso",
          user: result.user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
  } catch (error) {
    console.error("Error in API login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

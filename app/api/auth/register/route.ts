import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, user_type } = body;

    // Basic validations
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Register user
    const result = await registerUser({
      name,
      email,
      password,
      user_type: user_type || "client",
    });

    if (result.success) {
      return NextResponse.json(
        {
          message: "Usuario registrado exitosamente",
          user: result.user,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in API register:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { updateUserStatus } from "@/lib/auth";
import { Tables } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, admin_id } = body;

    if (!status || !["active", "inactive"].includes(status)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    const result = await updateUserStatus(
      params.id,
      status as Tables<"users">["status"],
      admin_id
    );

    if (result.success) {
      return NextResponse.json(
        { message: "Estado del usuario actualizado exitosamente" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error || "Error al actualizar estado del usuario" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in update user status API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/auth";
import { Tables } from "@/types/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || undefined;
    const userType = searchParams.get("user_type") as Tables<'users'>['user_type'] | undefined;
    const status = searchParams.get("status") as Tables<'users'>['status'] | undefined;

    const result = await getUsers(limit, offset, search, userType, status);

    if (result.success && result.users) {
      return NextResponse.json({
        users: result.users,
        totalCount: result.totalCount,
        limit,
        offset,
      }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error || "Error al obtener usuarios" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

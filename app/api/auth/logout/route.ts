import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getCurrentUser } from "@/lib/session-server";
import { logSessionAction } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get current user before deleting session
    const user = getCurrentUser();
    
    // Delete session
    deleteSession();

    // Log logout action
    if (user) {
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      await logSessionAction(
        user.id,
        'logout',
        ipAddress,
        userAgent
      );
    }

    return NextResponse.json(
      { message: "Sesión cerrada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API logout:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

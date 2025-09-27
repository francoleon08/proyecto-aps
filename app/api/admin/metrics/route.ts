import { NextRequest, NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const result = await getDashboardMetrics();

    if (result.success && result.metrics) {
      return NextResponse.json(result.metrics, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error || "Error al obtener métricas" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in metrics API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

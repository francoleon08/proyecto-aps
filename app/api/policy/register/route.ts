import { NextRequest, NextResponse } from "next/server";
import { createContractedPolicy } from "@/actions/policies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { insuranceType, clientType, multiplier, policyData, selectedPlan, basePrices } = body;
    console.log("ejemplooooooooooooooooooooooooooooooooooooooooo")
    console.log(body)
    
    return NextResponse.json(
        {
            message: "Testing policy body"
        },
        { status: 200 })



/*    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }
    


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
    }*/
  } catch (error) {
    console.error("Error in API policy register:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

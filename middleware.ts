import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser, isAuthenticated, hasRole } from '@/lib/session-server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const { pathname } = request.nextUrl

  // si la ruta es de autenticación pero el usuario esta logueado, redirigir al dashboard
  const isAuthRoute = pathname.match('/login') || pathname.match('/register')
  if (isAuthRoute && isAuthenticated()) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/' + getCurrentUser()?.user_type
    return NextResponse.redirect(url)
  }

  // si la ruta es pública, dejar pasar
  const isPublicRoute = isAuthRoute || pathname.match('/unauthorized')
  if (isPublicRoute) {
    return response
  }

  // si el cliente no está logueado, redirigir al login
  if (!isAuthenticated()) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // si la ruta es un dashboard pero no coincide con el tipo de usuario,
  // entonces redirigirlo al dashboard que sí le corresponde
  const isDashboard = pathname.startsWith('/dashboard')
  if (isDashboard) {
    const userType = getCurrentUser()?.user_type
    const dashboardType = pathname.split('/')[2]
    if (dashboardType && dashboardType !== userType) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(`/dashboard/${dashboardType}`, `/dashboard/${userType}`)
      return NextResponse.redirect(url)
    }
  }

  // si la ruta es sólo para admins y el usuario no tiene ese rol, redirigir a no-autorizado
  const isAdminRoute = pathname.includes('/admin') || pathname.startsWith('/plans')
  if (isAdminRoute && !hasRole('admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  // si la ruta es sólo para empleados y el usuario no tiene ese rol, redirigir a no-autorizado
  const isEmployeeRoute = pathname.startsWith('/requests')
  if (isEmployeeRoute && !hasRole('employee')) {
    const url = request.nextUrl.clone()
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  return response
}

// proteger todas las rutas, excepto estáticos y API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

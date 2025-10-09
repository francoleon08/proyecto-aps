import { NextResponse } from 'next/server'
import { isAuthenticated, hasRole } from '@/lib/session-server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const { pathname } = request.nextUrl

  // si la ruta es pública, dejar pasar
  const publicPaths = ['/login', '/register', '/unauthorized']
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return response
  }

  if (!isAuthenticated()) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const isAdminRoute = pathname.includes('/admin')
  if (isAdminRoute && !hasRole('admin')) {
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

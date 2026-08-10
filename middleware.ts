import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Leemos la cookie de sesión
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // 1. Si intenta ingresar a /login teniendo sesión activa -> Redirigir a /my-panel
  if (pathname.startsWith('/login') && sessionCookie) {
    return NextResponse.redirect(new URL('/my-panel', request.url));
  }

  // 2. Si intenta ingresar a /my-panel sin sesión -> Redirigir a /login
  if (pathname.startsWith('/my-panel') && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    // Guardamos opcionalmente la ruta a la que intentaba ir
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configurar las rutas en las que se ejecutará el middleware
export const config = {
  matcher: ['/login', '/my-panel/:path*'],
};
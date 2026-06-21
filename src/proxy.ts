import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  const isAuthPage = path.startsWith('/login') || path.startsWith('/register')
  const isDashboard = path.startsWith('/dashboard')
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL


  if (isDashboard) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url)) 
    }
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/', request.url)) 
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register'
  ],
}
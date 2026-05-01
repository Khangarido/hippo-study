import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  if (!session && (req.nextUrl.pathname.startsWith('/dashboard') || 
                   req.nextUrl.pathname.startsWith('/exam') || 
                   req.nextUrl.pathname.startsWith('/admin') ||
                   req.nextUrl.pathname.startsWith('/results/'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin-only routes
  if (session && req.nextUrl.pathname.startsWith('/admin')) {
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/exam/:path*', '/admin/:path*', '/results/:path*'],
}

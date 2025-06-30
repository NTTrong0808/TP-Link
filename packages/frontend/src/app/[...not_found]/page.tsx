'use client'

import { AuthForbidden } from '@/lib/auth/components'

export default function CatchAllRouteNotFound() {
  return <AuthForbidden className="h-screen" />
}

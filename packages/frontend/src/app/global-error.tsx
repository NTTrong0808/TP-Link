'use client'

import { AuthForbidden } from '@/lib/auth/components'

export default function GlobalInternalServerError() {
  return <AuthForbidden className="h-screen" />
}

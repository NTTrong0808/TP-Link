'use client'

import { AuthForbidden } from '@/lib/auth/components'

export default function InternalServerError() {
  return <AuthForbidden className="h-screen" />
}

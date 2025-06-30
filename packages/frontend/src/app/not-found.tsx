import { AuthForbidden } from '@/lib/auth/components'

export default function NotFound() {
  return <AuthForbidden className="h-screen" />
}

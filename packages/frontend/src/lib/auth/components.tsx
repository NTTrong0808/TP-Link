'use client'

import { Button } from '@/components/ui/button'
import DinosaurBlockImage from '@/components/widgets/icons/dinosaur-block-image'
import DinosaurLoadingImage from '@/components/widgets/icons/dinosaur-loading-image'
import { AUTH_GUARD_EXCEPTION_PATHS, AUTH_GUARD_PROTECTED_PATHS, AUTH_GUARD_PUBLIC_PATHS, URLS } from '@/constants/urls'
import { redirect, usePathname, useRouter } from 'next/navigation'
import { ComponentProps, memo, PropsWithChildren, useMemo } from 'react'
import { cn } from '../tw'
import { useCanAccess } from './casl'
import { useAuth } from './context'
export interface AuthLoadingProps extends PropsWithChildren {
  loading?: boolean
  label?: string
}

export const AuthLoading = memo(({ children, loading, label = 'Đang tải trang' }: AuthLoadingProps) => {
  return loading ? (
    <div className="fixed left-0 top-0 z-[9999] flex min-h-screen w-full items-center justify-center bg-green-50">
      <div className="flex flex-col gap-4 text-sm [&_i.ant-spin-dot-item]:!bg-primary-foreground">
        <div className="relative">
          <DinosaurLoadingImage />
        </div>

        <p className="text-center text-sm font-bold !text-primary-foreground">{label}</p>
      </div>
    </div>
  ) : (
    children
  )
})

AuthLoading.displayName = 'AuthLoading'

export interface AuthForbiddenProps extends ComponentProps<'div'> {
  label?: string
  description?: string
}

export const AuthForbidden = ({
  label = 'Bạn không có quyền truy cập',
  description = 'Vui lòng liên hệ quản trị viên để được hỗ trợ',
  ...props
}: AuthForbiddenProps) => {
  const router = useRouter()

  return (
    <div
      className={cn(
        'flex-1 z-[9999] flex flex-col w-full h-full items-center justify-center text-green-700 text-center gap-10',
        props.className,
      )}
    >
      <div className="flex flex-col gap-2 items-center justify-center font-langfarm font-semibold">
        <div className="text-3xl">Truy cập bị từ chối</div>
        <div className="text-4xl">Bạn không có quyền truy cập</div>
      </div>
      <DinosaurBlockImage />
      <div>
        <div className="mb-4">Vui lòng liên hệ quản trị viên và thử lại</div>
        <Button onClick={() => router.push(URLS.HOME)}>Quay về trang chủ</Button>
      </div>
    </div>
  )
}

AuthForbidden.displayName = 'AuthForbidden'

export interface AuthGuardProps extends PropsWithChildren {
  type: 'redirect' | 'authorize'
  loading?: boolean
}

// Check for dynamic paths with parameters (e.g., /users/:id)

export const AuthGuard = memo(({ children, type, loading }: AuthGuardProps) => {
  const pathname = usePathname()

  const { cognitoUser, role } = useAuth()
  const isCanAccess = useCanAccess()
  const dynamicPaths = useMemo(
    () =>
      [...Object.keys(AUTH_GUARD_PROTECTED_PATHS), ...Object.keys(AUTH_GUARD_PUBLIC_PATHS)].filter((path) =>
        path.includes(':'),
      ),
    [],
  )

  if (loading) return <AuthLoading loading={loading} />

  if (type === 'authorize') {
    // Check public paths
    if (pathname && AUTH_GUARD_PUBLIC_PATHS[pathname]) {
      return children
    }

    // Check dynamic paths
    const matchingPath = dynamicPaths.find((path) => {
      const pattern = path.replace(/:\w+/g, '[^/]+').replace(/\/$/, '') + '$'
      return new RegExp(`^${pattern}$`).test(pathname)
    })

    const protectedPath =
      AUTH_GUARD_PROTECTED_PATHS?.[matchingPath as keyof typeof AUTH_GUARD_PROTECTED_PATHS] ??
      AUTH_GUARD_PROTECTED_PATHS?.[pathname]

    if (matchingPath && AUTH_GUARD_PUBLIC_PATHS[matchingPath] && !protectedPath) {
      return children
    }
    // Check authentication
    if (!(cognitoUser && role)) {
      return redirect(URLS.AUTH.SIGN_IN)
    }

    const isAllowPath = isCanAccess(protectedPath as any)

    if (isAllowPath && protectedPath) {
      return children
    }

    // Check exception paths
    if (AUTH_GUARD_EXCEPTION_PATHS[pathname]) {
      return children
    }

    // Check protected paths
    if (!isAllowPath) {
      return redirect(URLS.ADMIN.FORBIDDEN)
    }
  }

  return children
})

AuthGuard.displayName = 'AuthGuard'

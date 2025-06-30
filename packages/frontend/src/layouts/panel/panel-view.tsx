'use client'

import Loader from '@/components/ui/loader'
import { cn } from '@/lib/tw'
import isNil from 'lodash/isNil'
import { usePathname } from 'next/navigation'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

export type PanelViewVariant = 'fit-container' | 'hug-content'

export interface PanelViewContextType {
  variant: PanelViewVariant
}

export const PanelViewContext = createContext<PanelViewContextType>({
  variant: 'fit-container',
} as PanelViewContextType)

export const usePanelView = () => {
  const ctx = useContext(PanelViewContext)

  if (!ctx) throw new Error('usePanelView must be used within a PanelViewContext')

  return ctx
}

export interface PanelViewProps extends React.ComponentProps<'div'> {
  variant?: PanelViewVariant
  loading?: boolean
}

export const PanelView = ({ children, variant = 'fit-container', loading, ...props }: PanelViewProps) => {
  const ref = useRef<HTMLElement>(null)

  const values = useMemo<PanelViewContextType>(
    () => ({
      variant,
    }),
    [variant],
  )

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      ref.current.style.setProperty('--panel-view-root-offset-top', `${Number(rect.top || 0)}px`)
    }
  }, [ref.current])

  return (
    <PanelViewContext.Provider value={values}>
      <section
        ref={ref}
        data-panel-view-root
        {...props}
        className={cn(
          'flex flex-col gap-4 h-[calc(100svh-var(--panel-view-root-offset-top,0px))]',
          'bg-neutral-grey-50 p-4',
          'overflow-hidden',
          'relative',
          props.className,
        )}
      >
        {children}
        <Loader loading={loading} />
      </section>
    </PanelViewContext.Provider>
  )
}

export interface PanelViewHeaderProps extends React.ComponentProps<'div'> {
  title?: string
  badge?: ReactNode
  action?: ReactNode | ReactNode[]
}

export const PanelViewHeader = ({ children, title, badge, action, ...props }: PanelViewHeaderProps) => {
  const pathname = usePathname()

  const ref = useCallback(
    (node: HTMLElement) => {
      if (node) {
        const root = node.parentElement?.closest('[data-panel-view-root]') as HTMLElement

        if (!root) return

        root.style.setProperty('--panel-view-header-height', `${node.clientHeight}px`)
      }
    },
    [pathname],
  )

  return (
    <header
      data-panel-view-header
      {...props}
      ref={ref}
      className={cn('min-h-10 flex gap-4 items-center', props.className)}
    >
      {title ? (
        <div className="flex items-center gap-2 shrink-0">
          {title && <h2 className="text-base font-medium text-neutral-black">{title}</h2>}
          {!isNil(badge) && (
            <div className="bg-neutral-grey-200 px-2 py-1.5 rounded-sm text-neutral-black min-w-10 items-center flex justify-center">
              {badge}
            </div>
          )}
        </div>
      ) : null}

      {children}

      {action ? <div className="ml-auto flex gap-4">{action}</div> : null}
    </header>
  )
}

export interface PanelViewContentProps extends React.ComponentProps<'div'> {
  loading?: boolean
}

export const PanelViewContent = ({ children, loading, ...props }: PanelViewContentProps) => {
  const { variant } = usePanelView()
  const pathname = usePathname()

  const ref = useCallback(
    (node: HTMLElement) => {
      if (node) {
        const root = node.parentElement?.closest('[data-panel-view-root]') as HTMLElement

        if (!root) return
        root.style.setProperty('--panel-view-content-height', `${node.clientHeight}px`)
      }
    },
    [pathname],
  )

  return (
    <main
      {...props}
      data-panel-view-content
      data-variant={variant}
      ref={ref}
      className={cn(
        'h-10 data-[variant=fit-container]:grow relative',
        // "data-[variant=fit-container]:h-[calc(100svh-var(--panel-view-header-height,0px))]",
        // "data-[variant=hug-content]:h-full",
        'overflow-y-auto',
        props.className,
      )}
    >
      {children}
      <Loader loading={loading} />
    </main>
  )
}

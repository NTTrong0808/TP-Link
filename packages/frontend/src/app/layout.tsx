import AuthProvider from '@/lib/auth/context'
import { beVietnamPro, langfarmFont } from '@/lib/font'
import { ReactQueryProviders } from '@/lib/query/provider'
import { cn } from '@/lib/tw'
import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Dialoger } from '@/components/widgets/dialoger'
import { DraftOrdersProvider } from '@/features/kios/providers/draft-orders-provider'
import { PrintProvider } from '@/features/print/contexts/print-portal-context'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'LangFarm',
  description: 'LangFarm - Nền tảng quản lý dịch vụ',
  applicationName: 'LangFarm',
  authors: [{ name: 'LangFarm' }],
  keywords: ['langfarm', 'quản lý', 'dịch vụ', 'nền tảng'],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          beVietnamPro.variable,
          langfarmFont.variable,
          // iCiel_Tungsten.variable,
          'font-beVietnamPro antialiased',
        )}
      >
        <Suspense>
          <NuqsAdapter>
            <ReactQueryProviders>
              <AuthProvider>
                <DraftOrdersProvider>
                  <PrintProvider>
                    {children}
                    <Dialoger />
                    <Toaster />
                  </PrintProvider>
                </DraftOrdersProvider>
              </AuthProvider>
            </ReactQueryProviders>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  )
}

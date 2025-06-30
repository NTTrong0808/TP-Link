import { Be_Vietnam_Pro } from 'next/font/google'
import localFont from 'next/font/local'

export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin', 'latin-ext'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  variable: '--font-be-vietnam-pro',
})

export const langfarmFont = localFont({
  src: [
    {
      path: '../assets/fonts/langfarm-font/LangfarmDisplay-Semibold.woff2',
      style: 'semibold',
      weight: '600',
    },
  ],
  variable: '--font-langfarm',
})

export const iCiel_Tungsten = localFont({
  src: [
    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-Thin.otf',
      style: 'thin',
      weight: '100',
    },

    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-ExtraLight.otf',
      style: 'extralight',
      weight: '200',
    },
    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-Light.otf',
      style: 'light',
      weight: '300',
    },
    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-Book.otf',
      style: 'regular',
      weight: '400',
    },
    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-Medium.otf',
      style: 'medium',
      weight: '500',
    },
    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-Semibold.otf',
      style: 'semibold',
      weight: '600',
    },
    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-Bold.otf',
      style: 'bold',
      weight: '700',
    },
    {
      path: '../assets/fonts/langfarm-font/iCielTungsten-Black.otf',
      style: 'black',
      weight: '900',
    },
  ],
  variable: '--font-iCiel_Tungsten',
})

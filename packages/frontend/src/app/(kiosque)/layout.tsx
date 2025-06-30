import { URLS } from '@/constants/urls'
import { KiosquePanel, KiosquePanelContent, KiosquePanelHeader, KiosquePanelMenu } from '@/layouts/kiosque'
import { PropsWithChildren, useMemo } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  const menu = useMemo<KiosquePanelMenu[]>(
    () => [
      {
        label: 'Mở màn hình phụ',
        url: URLS.KIOS.EXTEND_DISPLAY,
        disabled: false,
        target: '_blank',
      },
    ],
    [],
  )

  return (
    <KiosquePanel>
      <KiosquePanelHeader menu={menu} />
      <KiosquePanelContent className="flex flex-col">{children}</KiosquePanelContent>
    </KiosquePanel>
  )
}

export default Layout

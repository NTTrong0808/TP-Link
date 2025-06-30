import React from 'react'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col flex-1 mx-auto max-w-[375px] font-beVietnamPro bg-neutral-grey-50 text-neutral-black min-h-svh">
      <div className="flex-1 flex flex-col">{children}</div>
      <footer className="flex flex-col gap-2.5 text-xs font-semibold text-neutral-grey-400 px-4 py-6 text-center text-pretty">
        <div>
          Copyright © 2025 Langfarm Center LLC.
          <br /> All rights reserved.
        </div>
        <div>Powered by WhammyTech</div>
      </footer>
    </div>
  )
}

export default Layout

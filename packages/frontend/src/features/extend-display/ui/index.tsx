'use client'

import headerImage from '@/assets/images/header-decor.png'
import { Button } from '@/components/ui/button'
import KiosContextProvider from '@/features/kios/components/kios-context'
import { MaximizeIcon, MinimizeIcon } from 'lucide-react'
import Image from 'next/image'
import { RefObject, useRef } from 'react'
import { useFullscreen, useToggle } from 'react-use'
import SummarySection from '../components/summary-section'

import topServiceDecorImage from '@/assets/images/top-services-decor.png'

const ExtendDisplay = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null)
  const [show, toggle] = useToggle(false)

  const isFullscreen = useFullscreen(fullScreenRef as RefObject<Element>, show, { onClose: () => toggle(false) })

  return (
    <KiosContextProvider>
      <div className="flex p-5 gap-5 text-base h-full bg-neutral-grey-50 relative" ref={fullScreenRef}>
        <Image src={headerImage} alt="header" className="absolute top-0 left-0 w-full" />
        <Image src={topServiceDecorImage} alt="header" className="absolute bottom-0 left-0 w-full" />
        <div className="flex-[2_1_0%] h-full flex flex-col gap-2 justify-center items-center relative">
          <div className="flex flex-col text-center font-langfarm">
            <p className="text-3xl text-green-600">Khám phá</p>
            <p className="text-5xl text-brown-600">Langfarm Center</p>
          </div>

          <div className="rounded-lg shadow-[0px_1px_2px_0px_rgba(9,9,11,0.05)]">
            <video autoPlay muted loop className="w-full h-auto rounded-lg">
              <source src="https://langfarm-backend.s3.ap-southeast-1.amazonaws.com/lfc-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <Button variant="outline" size="sm" className="w-fit absolute top-0 left-0" onClick={toggle}>
            {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
        </div>

        <SummarySection />
      </div>
    </KiosContextProvider>
  )
}

export default ExtendDisplay

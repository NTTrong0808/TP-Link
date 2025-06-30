import { usePanelContext } from '@/layouts/panel'
import { useEffect } from 'react'

interface UseHeaderProps {
  title?: string
  isBack?: boolean
}

const useHeader = ({ title, isBack = false }: UseHeaderProps = {}) => {
  const { setTitle, setIsBack } = usePanelContext()

  useEffect(() => {
    if (title) {
      setTitle(title)
    }
    if (isBack) {
      setIsBack(isBack)
    }

    return () => {
      setTitle('Page Title')
      setIsBack(false)
    }
  }, [title, isBack, setTitle, setIsBack])

  return {
    setTitle,
    setIsBack,
  }
}

export default useHeader

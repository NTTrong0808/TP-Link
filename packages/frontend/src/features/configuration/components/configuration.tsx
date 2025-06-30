import { Switch } from '@/components/ui/switch'
import CaretRightIcon from '@/components/widgets/icons/caret-right-icon'
import { useGetMediaFile } from '@/lib/api/queries/upload/queries/use-get-media-file'
import { cn } from '@/lib/tw'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { ComponentProps, ReactNode } from 'react'
import { useBoolean } from 'react-use'

export const ConfigurationSection = (props: ComponentProps<'section'>) => {
  return (
    <section
      {...props}
      className={cn(
        'w-full max-w-[500px] max-h-full flex-1 p-6 mx-auto font-medium',
        'border border-low rounded-lg bg-neutral-white',
        'flex flex-col gap-6 overflow-auto relative',
        props.className,
      )}
    />
  )
}

export const ConfigurationContent = (props: ComponentProps<'div'>) => {
  return <div {...props} className={cn('flex flex-col gap-4', props.className)} />
}

export const ConfigurationHeader = (props: ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('flex gap-2 justify-between items-center text-base font-medium', props.className)} />
  )
}

export interface ConfigurationItemGroupProps extends ComponentProps<'div'> {
  imageId?: string
  imageUrl?: string
  title: string
  description?: ReactNode
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  loading?: boolean
  disabled?: boolean
  toggleable?: boolean
}

export const ConfigurationItemGroup = ({
  toggleable,
  onCheckedChange,
  imageId,
  imageUrl,
  loading,
  disabled,
  ...props
}: ConfigurationItemGroupProps) => {
  // const childRef = useRef<HTMLDivElement>(null)
  const [showExtended, toggleShowExtended] = useBoolean(false)

  // const [childHeight, setChildHeight] = useState(0)

  // useEffect(() => {
  //   if (childRef.current) {
  //     setChildHeight(childRef.current.clientHeight)
  //   }
  // }, [childRef.current])

  return (
    <div
      {...props}
      className={cn(
        'flex flex-col gap-3 p-5 rounded-lg border border-low',
        'transition-all duration-300 ease-in-out',
        props.className,
      )}
    >
      <div className="flex gap-4 justify-between items-center py-1">
        <ConfigurationItem
          imageId={imageId}
          imageUrl={imageUrl}
          title={props.title}
          description={props.description}
          defaultChecked={props.defaultChecked}
          onCheckedChange={onCheckedChange}
          toggleable={toggleable}
          loading={loading}
          disabled={disabled}
          className="bg-white rounded-none flex-1 p-0"
        />
        {props.children ? (
          <div className="flex items-center gap-4 self-stretch" onClick={() => toggleShowExtended()}>
            <div className="w-px bg-neutral-grey-300 self-stretch" />
            <CaretRightIcon
              className={cn(
                'w-4 h-4',
                'transition-all duration-300 ease-in-out',
                showExtended ? 'rotate-90' : 'rotate-0',
              )}
            />
          </div>
        ) : null}
      </div>
      <div className={cn('flex flex-col gap-2', 'transition-all duration-300 ease-in-out', !showExtended && 'hidden')}>
        {props.children}
      </div>
    </div>
  )
}

export interface ConfigurationItemProps extends ComponentProps<'div'> {
  imageId?: string
  imageUrl?: string
  title: string
  description?: ReactNode
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  loading?: boolean
  disabled?: boolean
  toggleable?: boolean
}
export const ConfigurationItem = ({
  toggleable,
  onCheckedChange,
  imageId,
  imageUrl,
  loading,
  disabled,
  ...props
}: ConfigurationItemProps) => {
  const { mutateAsync: getMediaFile } = useGetMediaFile()

  const { data: mediaFile } = useQuery({
    queryKey: ['mediaFile', imageId],
    queryFn: () => getMediaFile({ mediaId: imageId ?? '' }),
    enabled: !!imageId,
    select: (resp) => resp?.data?.previewURL,
    retry: 3,
  })

  return (
    <div {...props} className={cn('flex gap-3 p-3 rounded-lg bg-neutral-grey-50 items-center', props.className)}>
      {(imageId || imageUrl) && (
        <div className={cn('rounded-md p-2 bg-white border border-low', 'w-[40px] h-[40px]')}>
          <Image
            src={
              mediaFile ?? imageUrl ?? 'https://www.discountflooringsupplies.com.au/wp-content/uploads/blank-img.jpg'
            }
            alt={props.title}
            width={24}
            height={24}
          />
        </div>
      )}
      <div className="flex-1 text-sm font-medium">
        <div>{props.title}</div>
        <div className="text-xs font-normal text-neutral-grey-400">{props?.description}</div>
      </div>
      {toggleable && (
        <Switch
          defaultChecked={props?.defaultChecked}
          disabled={loading || disabled}
          onCheckedChange={(checked) => {
            if (loading || disabled) return
            onCheckedChange?.(checked)
          }}
        />
      )}
    </div>
  )
}

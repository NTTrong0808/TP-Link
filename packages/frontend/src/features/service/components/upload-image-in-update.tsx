import PlusIcon from '@/components/widgets/icons/plus-icon'
import { useGetMediaFile } from '@/lib/api/queries/upload/queries/use-get-media-file'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { ServiceSampleImages } from '../constants/service-sample-images'
import { cn } from '@/lib/tw'
import Image from 'next/image'

type Props = {
  onChangeFileImage: (file: File | string) => void
  image?: string
}

const UploadImageInUpdate = ({ onChangeFileImage, image }: Props) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [choosenSampleImage, setChoosenSampleImage] = useState<string | null>(null)

  const { mutateAsync: getMediaFIle, isPending } = useGetMediaFile()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onChangeFileImage(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = () => {
    setChoosenSampleImage(null)
    if (inputFileRef?.current) inputFileRef?.current?.click()
  }

  const handleChangeSampleImage = (sampleImage: string) => {
    setChoosenSampleImage(sampleImage)
    onChangeFileImage(sampleImage)
  }

  useEffect(() => {
    if (!image) return
    getMediaFIle({
      mediaId: image,
    }).then((value) => {
      if (value?.data?.previewURL) setPreview(value?.data?.previewURL)
    })
  }, [image])

  return (
    <div className="p-1 border rounded-md bg-[#F5F5F5] flex items-center gap-2 w-fit">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 hidden"
        hidden
        ref={inputFileRef}
      />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-16 h-16 max-w-16 max-h-16 object-cover rounded-sm bg-white"
          onClick={handleUpload}
        />
      ) : (
        <div
          onClick={handleUpload}
          className="flex items-center justify-center w-16 h-16 max-w-16 max-h-16 rounded-sm border-[0.5px] border-dashed border-neutral-grey-200 bg-white"
        >
          <PlusIcon className="size-5 text-[#616161]" />
        </div>
      )}
      {ServiceSampleImages.map((image) => (
        <div
          onClick={() => handleChangeSampleImage(image.id)}
          className={cn(
            'w-16 h-16 max-w-16 max-h-16 rounded-md bg-white',
            image.id === choosenSampleImage && 'border border-green-500',
          )}
          key={image.id}
        >
          <Image width={0} height={0} src={image.image} alt={image.id} className="w-" />
        </div>
      ))}
    </div>
  )
}

export default UploadImageInUpdate

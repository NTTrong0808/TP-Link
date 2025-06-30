import PlusIcon from '@/components/widgets/icons/plus-icon'
import React, { useRef, useState } from 'react'
import { ServiceSampleImages } from '../constants/service-sample-images'
import Image from 'next/image'
import { cn } from '@/lib/tw'

type Props = {
  onChangeFileImage: (file: File | string) => void
}

const UploadImage = ({ onChangeFileImage }: Props) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [choosenSampleImage, setChoosenSampleImage] = useState<string | null>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onChangeFileImage(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleChangeSampleImage = (sampleImage: string) => {
    setChoosenSampleImage(sampleImage)
    onChangeFileImage(sampleImage)
  }

  const handleUpload = () => {
    setChoosenSampleImage(null)
    if (inputFileRef?.current) inputFileRef?.current?.click()
  }

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
          key={image.id}
          onClick={() => handleChangeSampleImage(image.id)}
          className={cn(
            'w-16 h-16 max-w-16 max-h-16 rounded-md bg-white',
            image.id === choosenSampleImage && 'border border-green-500',
          )}
        >
          <Image width={0} height={0} src={image.image} alt={image.id} className="w-" />
        </div>
      ))}
    </div>
  )
}

export default UploadImage

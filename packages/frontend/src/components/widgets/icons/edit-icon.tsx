import { ComponentProps } from 'react'

const EditIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M12.3941 4.98374L15.0133 7.59773M13.5052 3.87487C13.8525 3.52823 14.3236 3.3335 14.8148 3.3335C15.306 3.3335 15.777 3.52823 16.1244 3.87487C16.4717 4.22151 16.6668 4.69164 16.6668 5.18186C16.6668 5.67208 16.4717 6.14222 16.1244 6.48885L5.92604 16.6668H3.3335V14.0262L13.5052 3.87487Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default EditIcon

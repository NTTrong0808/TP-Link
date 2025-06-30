const Loading = () => {
  return (
    <div className="flex min-h-full w-full items-center justify-center">
      <div className="flex flex-col gap-4 text-sm [&_i.ant-spin-dot-item]:!bg-primary-foreground">
        <p className="text-center text-sm font-bold !text-primary-foreground">Đang xác thực</p>
      </div>
    </div>
  )
}

export default Loading

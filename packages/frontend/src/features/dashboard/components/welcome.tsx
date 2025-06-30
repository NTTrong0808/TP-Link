import DinosaurWelcomeImage from '@/components/widgets/icons/dinosaur-welcome-image'

export default function Welcome() {
  // const { cognitoUser } = useAuth();

  // if (!cognitoUser) {
  //   return redirect(URLS.AUTH.SIGN_IN);
  // }

  return (
    <div className="flex flex-col gap-10 items-center justify-center text-green-700 h-full">
      <div className="flex flex-col gap-2 items-center justify-center font-langfarm font-semibold">
        <div className="text-3xl">Chào mừng đến trang quản lý</div>
        <div className="text-4xl">Langfarm Ticket</div>
      </div>
      <DinosaurWelcomeImage />
      <div>Vui lòng chọn thao tác để bắt đầu</div>
    </div>
  )
}

import ResetPassword from "@/features/auth/ui/reset-password";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const param = await params;
  return <ResetPassword {...param} />;
}

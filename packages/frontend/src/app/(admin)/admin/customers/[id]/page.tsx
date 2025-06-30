import CustomerDetailPage from "@/features/customer-detail/ui/page";

type Props = {
  params: Promise<{ id: string }>;
};
const Page = async ({ params }: Props) => {
  const { id } = await params;

  return <CustomerDetailPage customerId={id} />;
};

export default Page;

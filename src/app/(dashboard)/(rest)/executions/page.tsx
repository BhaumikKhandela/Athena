import { requireAuth } from "@/lib/auth-utils";
interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}
const Page = async ({ params }: PageProps) => {
  await requireAuth();
  return <p>Executions</p>;
};

export default Page;

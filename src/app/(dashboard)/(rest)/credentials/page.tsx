import { requireAuth } from "@/lib/auth-utils";
interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}
const Page = async ({ params }: PageProps) => {
  await requireAuth();
  return <p>Credentials</p>;
};

export default Page;

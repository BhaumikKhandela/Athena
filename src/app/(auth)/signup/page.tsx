import { SignUpForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return <SignUpForm />;
};

export default Page;

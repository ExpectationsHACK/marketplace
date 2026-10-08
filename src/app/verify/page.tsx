import { VerifyWizard } from "./verify-wizard";

export const metadata = { title: "Get verified" };

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:pt-12">
      <VerifyWizard />
    </div>
  );
}

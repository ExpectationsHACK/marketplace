import { OnboardingWizard } from "./onboarding-wizard";

export const metadata = { title: "Open a shop" };

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:pt-12">
      <h1 className="text-[2rem] font-black leading-tight tracking-[-0.03em] sm:text-5xl">Open your shop</h1>
      <p className="mt-2 max-w-xl text-subdued">
        A permanent link, a catalog, and orders straight to your WhatsApp. No app to install, no code, no WhatsApp Business API.
      </p>
      <div className="mt-10">
        <OnboardingWizard />
      </div>
    </div>
  );
}

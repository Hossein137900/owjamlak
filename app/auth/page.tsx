import AuthPageContainer from "@/components/static/auth/auth-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " صفحه ورود | اوج",
  description:
    "با تیم املاک در تماس باشید. ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم.",
};
export default function AuthPage() {
  return (
    <section>
      <AuthPageContainer />
    </section>
  );
}

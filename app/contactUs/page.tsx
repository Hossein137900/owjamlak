import ContactFaq from "@/components/static/contact/contact-faq";
import ContactForm from "@/components/static/contact/contact-form";
import ContactHero from "@/components/static/contact/contact-hero";
import ContactInfo from "@/components/static/contact/contact-info";
import ContactMap from "@/components/static/contact/contact-map";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما | اوج",
  description:
    "با تیم املاک در تماس باشید. ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-16" dir="rtl">
      <ContactHero />
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ContactInfo />
        </div>
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
      <ContactMap />
      <ContactFaq />
    </main>
  );
}

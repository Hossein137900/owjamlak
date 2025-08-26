import VideoContainer from "@/components/static/videos/videoContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " ویدیوها | املاک اوج",
  description:
    "قوانین و مقررات استفاده از خدمات املاک ایران، شرایط خرید و فروش، حقوق و تعهدات طرفین",
  keywords:
    "قوانین املاک، مقررات خرید و فروش، شرایط استفاده، حقوق مشتری، تعهدات املاک",
  openGraph: {
    title: "قوانین و مقررات | املاک ایران",
    description: "قوانین و مقررات استفاده از خدمات املاک ایران",
    type: "website",
  },
};
export default function Video() {
  return (
    <main className="">
      <VideoContainer />
    </main>
  );
}

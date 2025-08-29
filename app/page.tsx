import CategoryBoxes from "@/components/global/categoryBoxes";
import WhyChooseUs from "@/components/global/whyUs";
import SliderMobile from "@/components/static/home/sliderMobile";
import RealEstateSearch from "@/components/static/home/heroSection";
import InvestmentBanner from "@/components/static/home/investmentBanner";
import OurApproachPage from "@/components/static/home/works";
import SEODescription from "@/components/static/ui/seoDesc";

export default function Home() {
  return (
    <div className="">
      <RealEstateSearch />

      <div className="block md:hidden">
        <SliderMobile />
      </div>
      <CategoryBoxes />
      <WhyChooseUs />
      <InvestmentBanner />
      <OurApproachPage />

      <SEODescription />
    </div>
  );
}

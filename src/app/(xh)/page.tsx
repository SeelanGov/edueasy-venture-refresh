import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AudienceTabs from "@/components/AudienceTabs";
import Steps from "@/components/Steps";
import FeatureGrid from "@/components/FeatureGrid";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import ConsentNotice from "@/components/ConsentNotice";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function XhosaHomePage() {
  return (
    <>
      <Header locale="xh" />
      <main id="main-content" className="flex-1">
        <Hero locale="xh" />
        <TrustStrip />
        <AudienceTabs locale="xh" />
        <Steps locale="xh" />
        <FeatureGrid locale="xh" />
        <Pricing locale="xh" />
        <FAQ locale="xh" />
        <ConsentNotice locale="xh" />
        <LeadForm locale="xh" />
      </main>
      <Footer locale="xh" />
    </>
  );
}
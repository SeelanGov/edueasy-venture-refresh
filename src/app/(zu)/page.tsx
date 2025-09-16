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

export default function ZuluHomePage() {
  return (
    <>
      <Header locale="zu" />
      <main id="main-content" className="flex-1">
        <Hero locale="zu" />
        <TrustStrip />
        <AudienceTabs locale="zu" />
        <Steps locale="zu" />
        <FeatureGrid locale="zu" />
        <Pricing locale="zu" />
        <FAQ locale="zu" />
        <ConsentNotice locale="zu" />
        <LeadForm locale="zu" />
      </main>
      <Footer locale="zu" />
    </>
  );
}
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

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <TrustStrip />
        <AudienceTabs />
        <Steps />
        <FeatureGrid />
        <Pricing />
        <FAQ />
        <ConsentNotice />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
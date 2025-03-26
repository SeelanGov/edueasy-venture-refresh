
import React from 'react';
import { Button } from "@/components/ui/button";
import { PatternBorder } from "@/components/PatternBorder";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-[#444444]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#3c702f] rounded-full flex items-center justify-center text-white font-bold">
              UBE
            </div>
            <h1 className="ml-3 text-xl md:text-2xl font-bold text-[#3c702f]">UBE KZN</h1>
          </div>
          
          <button className="md:hidden text-2xl" aria-label="Toggle menu">☰</button>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#about" className="text-[#333] font-medium hover:text-[#3c702f] transition-colors">About Us</a></li>
              <li><a href="#services" className="text-[#333] font-medium hover:text-[#3c702f] transition-colors">Our Services</a></li>
              <li><a href="#approach" className="text-[#333] font-medium hover:text-[#3c702f] transition-colors">Our Approach</a></li>
              <li><a href="#implementation" className="text-[#333] font-medium hover:text-[#3c702f] transition-colors">Implementation Areas</a></li>
              <li><a href="#contact" className="text-[#333] font-medium hover:text-[#3c702f] transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-32 bg-cover bg-center text-white text-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png')"
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto">BRIDGING THE GAP BETWEEN LAND RIGHTS AND ECONOMIC PROSPERITY</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Professional expertise helping communal property trusts and associations maximize their land potential.</p>
          <Button 
            size="lg" 
            className="text-lg bg-[#f5a623] hover:bg-[#7c4a1e] text-white font-semibold px-8 py-6 uppercase rounded"
          >
            Partner With Us
          </Button>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="about" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#3c702f] text-center mb-6 relative">
            Transforming Communal Land Into Sustainable Prosperity
            <span className="block w-16 h-1 bg-[#f5a623] mx-auto mt-4"></span>
          </h2>
          <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
            UBE KZN brings a unique blend of legal expertise and practical development knowledge to communal land management. 
            We work with communities as equal partners, ensuring inclusive decision-making and equitable benefit-sharing through our integrated approach.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Our Mission</h3>
              <p>We are a result-driven professional services provider that renders land management and development services that are accessible, 
              affordable, and designed to produce excellent results. Our mission is to inspire mental and financial growth both domestically and nationally.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Our Vision</h3>
              <p>To foster collaboration between businesses and communities as equal partners and stakeholders.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">The Community Challenge</h3>
              <p>Many communities have acquired land through restitution but face significant challenges in management, resources, planning, and participation. 
              UBE KZN bridges this gap by providing comprehensive support that transforms land assets into functioning enterprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-20 bg-[#f7f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3c702f] mb-4 relative inline-block">
              Integrated Communal Land Management Services
              <span className="block w-16 h-1 bg-[#f5a623] mx-auto mt-4"></span>
            </h2>
            <p className="text-lg">Our comprehensive approach ensures communities receive maximum value from their land assets</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              icon="📊" 
              title="Assessment & Planning" 
              items={["Land asset evaluation", "Community needs assessment", "Development opportunity identification", "Strategic utilization planning"]} 
            />
            
            <ServiceCard 
              icon="⚖️" 
              title="Governance Support" 
              items={["Communal Property Trust/Association management", "Transparent financial systems", "Community participation frameworks", "Conflict resolution mechanisms"]} 
            />
            
            <ServiceCard 
              icon="🔨" 
              title="Implementation" 
              items={["Project development and execution", "Stakeholder coordination", "Resource mobilization", "Technical expertise provision"]} 
            />
            
            <ServiceCard 
              icon="📈" 
              title="Management" 
              items={["Ongoing operational oversight", "Financial management", "Compliance and reporting", "Capacity building and training"]} 
            />
          </div>
        </div>
      </section>

      {/* The UBE KZN Difference */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#3c702f] text-center mb-12 relative">
            The UBE KZN Difference
            <span className="block w-16 h-1 bg-[#f5a623] mx-auto mt-4"></span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Legal Foundation</h3>
              <p>Led by an admitted attorney with extensive experience in land-related matters and representation of communal property structures.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Community Partnership</h3>
              <p>We work with communities as equal partners, ensuring inclusive decision-making and equitable benefit-sharing.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Integrated Approach</h3>
              <p>Our holistic land management strategy considers multiple complementary uses of community land assets.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Results Orientation</h3>
              <p>We focus on measurable outcomes: increased revenue, job creation, skills transfer, and sustainable management practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="approach" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3c702f] mb-4 relative inline-block">
              Our Process
              <span className="block w-16 h-1 bg-[#f5a623] mx-auto mt-4"></span>
            </h2>
            <p className="text-lg">A structured approach to transforming communal land into sustainable prosperity</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-4">
            <ProcessStep number="1" title="Engagement" description="Building relationships with community leadership" />
            <ProcessStep number="2" title="Assessment" description="Evaluating assets, needs, and opportunities" />
            <ProcessStep number="3" title="Planning" description="Creating integrated strategies" />
            <ProcessStep number="4" title="Implementation" description="Executing projects with community participation" />
            <ProcessStep number="5" title="Management" description="Providing ongoing support" />
            <ProcessStep number="6" title="Growth" description="Reinvesting and expanding initiatives" />
          </div>
        </div>
      </section>

      {/* Implementation Areas */}
      <section id="implementation" className="py-16 md:py-20 bg-[#f7f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3c702f] mb-4 relative inline-block">
              Strategic Implementation Areas
              <span className="block w-16 h-1 bg-[#f5a623] mx-auto mt-4"></span>
            </h2>
            <p className="text-lg">Transforming communal land into multi-faceted economic opportunities</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-2">
              <div className="h-32 bg-[#3c702f] flex items-center justify-center text-white text-5xl">
                🌳
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Forestry Development</h3>
                <p>Transforming community forestry assets through sustainable forest management, timber production and processing, non-timber forest product development, and environmental conservation initiatives.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-2">
              <div className="h-32 bg-[#3c702f] flex items-center justify-center text-white text-5xl">
                🏞️
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Tourism Opportunities</h3>
                <p>Unlocking the tourism potential of community lands through cultural tourism development, eco-tourism initiatives, tourism infrastructure development, and hospitality skills training.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-2">
              <div className="h-32 bg-[#3c702f] flex items-center justify-center text-white text-5xl">
                🌽
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c702f] mb-4">Commercial Food Farming</h3>
                <p>Building sustainable agricultural enterprises through commercial crop production, market access facilitation, agricultural technology adoption, and food security enhancement.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-2">
              <div className="h-32 bg-[#3c702f] flex items-center justify-center text-white text-5xl">
                🤝
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c702f] mb-4">KZN Social Economy Development</h3>
                <p>Creating broader community benefits through skills development programs, enterprise development support, job creation initiatives, and community reinvestment projects.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="contact" className="py-16 md:py-20 bg-[#f7f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3c702f] mb-4 relative inline-block">
              Partner With Us
              <span className="block w-16 h-1 bg-[#f5a623] mx-auto mt-4"></span>
            </h2>
            <p className="text-lg">Together we can transform communal land into community prosperity</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">For Communities</h3>
              <p>If your community owns land through a Communal Property Trust or Association, contact us to explore how our integrated land management approach can transform your assets into sustainable enterprises.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">For Businesses</h3>
              <p>We facilitate partnerships between businesses and communities that create mutual value. Explore investment and collaboration opportunities in our community projects.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-[#3c702f] mb-4">For Government</h3>
              <p>Our integrated approach complements government development initiatives. Let's collaborate to maximize the impact of land reform and community development programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-[#f5a623] text-xl font-semibold mb-4">UBE KZN</h3>
              <p className="mb-2">Integrated Communal Land Management Specialists</p>
              <p>Transforming communal land into community prosperity.</p>
            </div>
            
            <div>
              <h3 className="text-[#f5a623] text-xl font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li>[Address]</li>
                <li>[Phone]</li>
                <li>[Email]</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[#f5a623] text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-[#f5a623] transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-[#f5a623] transition-colors">Our Services</a></li>
                <li><a href="#approach" className="hover:text-[#f5a623] transition-colors">Our Approach</a></li>
                <li><a href="#implementation" className="hover:text-[#f5a623] transition-colors">Implementation Areas</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-gray-700">
            <p>&copy; {new Date().getFullYear()} UBE KZN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const ServiceCard = ({ icon, title, items }: { icon: string; title: string; items: string[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-2">
      <div className="h-32 bg-[#3c702f] flex items-center justify-center text-white text-5xl">
        {icon}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#3c702f] mb-4">{title}</h3>
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ProcessStep = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="w-40 text-center relative">
      <div className="w-14 h-14 bg-[#3c702f] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h4 className="text-lg font-semibold text-[#3c702f] mb-2">{title}</h4>
      <p className="text-sm">{description}</p>
      {number !== "6" && (
        <div className="hidden md:block absolute right-[-20px] top-6 text-2xl font-bold text-[#7c4a1e]">→</div>
      )}
    </div>
  );
};

export default Index;

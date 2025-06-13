
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Institutions = () => {
  const navigate = useNavigate();

  const institutions = [
    {
      id: "1",
      name: "University of Cape Town",
      type: "University",
      location: "Cape Town, Western Cape",
      programs: "Medicine, Engineering, Business, Law",
      studentCount: "29,000+",
      ranking: "#1 in Africa",
      isPartner: true,
      partnerTier: "Premium"
    },
    {
      id: "2",
      name: "University of the Witwatersrand",
      type: "University", 
      location: "Johannesburg, Gauteng",
      programs: "Mining Engineering, Medicine, Commerce",
      studentCount: "40,000+",
      ranking: "#2 in Africa",
      isPartner: true,
      partnerTier: "Standard"
    },
    {
      id: "3",
      name: "Stellenbosch University",
      type: "University",
      location: "Stellenbosch, Western Cape", 
      programs: "Agriculture, Engineering, Medicine",
      studentCount: "32,000+",
      ranking: "#3 in Africa",
      isPartner: false,
      partnerTier: null
    },
    {
      id: "4",
      name: "University of Pretoria",
      type: "University",
      location: "Pretoria, Gauteng",
      programs: "Veterinary Science, Engineering, Law",
      studentCount: "53,000+",
      ranking: "#4 in Africa",
      isPartner: true,
      partnerTier: "Basic"
    }
  ];

  const getTierColor = (tier: string | null) => {
    if (!tier) return '';
    switch (tier) {
      case 'Basic': return 'bg-gray-100 text-gray-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-cap-teal" />
            <Typography variant="h1" className="mb-0">
              Partner Institutions
            </Typography>
          </div>
          <Typography variant="lead" className="text-gray-600 mb-6">
            Discover the universities and colleges in our network
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/partner-inquiry')}
              className="bg-cap-teal hover:bg-cap-teal/90"
            >
              Become a Partner Institution
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/register')}
            >
              Apply as a Student
            </Button>
          </div>
        </div>

        {/* Partner Benefits Banner */}
        <Card className="mb-8 bg-gradient-to-r from-cap-teal to-cap-teal/80 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-white mb-2">
                  Join 50+ Institutions Using EduEasy
                </Typography>
                <Typography className="text-white/90">
                  Streamline admissions, reduce manual work by 80%, and connect with qualified students
                </Typography>
              </div>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-cap-teal"
                onClick={() => navigate('/partner-inquiry')}
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Institutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((institution, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(`/institutions/${institution.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-12 h-12 bg-cap-teal/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-cap-teal" />
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {institution.isPartner && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Partner
                      </Badge>
                    )}
                    {institution.partnerTier && (
                      <Badge className={getTierColor(institution.partnerTier)}>
                        {institution.partnerTier}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardTitle className="group-hover:text-cap-teal transition-colors">
                  {institution.name}
                </CardTitle>
                
                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    {institution.type} • {institution.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3 w-3" />
                    {institution.studentCount} students
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3" />
                    {institution.ranking}
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Typography variant="small" className="font-medium text-gray-700 mb-1">
                      Popular Programs:
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {institution.programs}
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-cap-teal hover:text-cap-teal hover:bg-cap-teal/10 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/institutions/${institution.id}`);
                      }}
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    
                    {!institution.isPartner && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/partner-inquiry');
                        }}
                      >
                        Partner with Us
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Typography variant="h3" className="mb-4">
                Don't See Your Institution?
              </Typography>
              <Typography variant="p" className="text-gray-600 mb-6">
                We're always looking to partner with more educational institutions across South Africa. 
                Get in touch to learn how EduEasy can transform your admissions process.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/partner-inquiry')}
                  className="bg-cap-teal hover:bg-cap-teal/90"
                >
                  Request Partnership Info
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/consultations')}
                >
                  Schedule a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Institutions;

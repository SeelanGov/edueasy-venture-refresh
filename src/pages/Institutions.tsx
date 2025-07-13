import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useInstitutions } from '@/hooks/useInstitutions';
import { ArrowRight, Building2, Loader2, MapPin, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Institutions = () => {
  const navigate = useNavigate();
  const { institutions, loading, error } = useInstitutions();
  const { user } = useAuth();

  const handleStartApplication = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please register an account to start your application.',
        variant: 'destructive',
      });
  
      navigate('/register', { state: { from: '/apply' } });
      return;
    }

    navigate('/apply');
  };

  if (loading) {
    return (
      <PageLayout gradient={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-cap-teal" />
            <Typography variant="p">Loading institutions...</Typography>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout gradient={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full mx-4 bg-white shadow-sm border border-gray-100">
            <CardContent className="p-8 text-center">
              <Typography variant="h3" className="text-red-600 mb-2">
                Error Loading Institutions
              </Typography>
              <Typography variant="p" className="text-gray-600 mb-4">
                {error}
              </Typography>
              <Button
                onClick={() => window.location.reload()}
                className="bg-cap-coral hover:bg-cap-coral/90"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Partner Institutions"
      subtitle="Discover the universities and colleges in our network"
      gradient={true}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/partner-inquiry')}
            className="bg-cap-teal hover:bg-cap-teal/90"
          >
            Become a Partner Institution
          </Button>
          <Button
            variant="outline"
            onClick={handleStartApplication}
            className="border-gray-200 text-gray-600 hover:border-cap-teal hover:text-cap-teal"
          >
            Start Application
          </Button>
        </div>

        {/* Partner Benefits Banner */}
        <Card className="bg-gradient-to-r from-cap-teal to-cap-teal/80 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-white mb-2">
                  Join {institutions.length}+ Institutions Using EduEasy
                </Typography>
                <Typography className="text-white/90">
                  Streamline admissions, reduce manual work by 80%, and connect with qualified
                  students
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
        {institutions.length === 0 ? (
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <Typography variant="h3" className="mb-2 text-gray-800">
                No Institutions Available
              </Typography>
              <Typography variant="p" className="text-gray-600 mb-6">
                We're currently adding institutions to our platform. Check back soon!
              </Typography>
              <Button
                onClick={() => navigate('/partner-inquiry')}
                className="bg-cap-teal hover:bg-cap-teal/90"
              >
                Partner with Us
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution) => (
              <Card
                key={institution.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white shadow-sm border border-gray-100"
                onClick={() => navigate(`/institutions/${institution.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-12 h-12 bg-cap-teal/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-cap-teal" />
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {institution.partner_id && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Partner</Badge>
                      )}
                    </div>
                  </div>

                  <CardTitle className="group-hover:text-cap-teal transition-colors text-gray-800">
                    {institution.name}
                  </CardTitle>

                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {institution.type} • {institution.location || institution.province}
                    </div>
                    {institution.student_count && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-3 w-3" />
                        {institution.student_count} students
                      </div>
                    )}
                    {institution.ranking && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-3 w-3" />
                        {institution.ranking}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {institution.programs && (
                      <div>
                        <Typography variant="small" className="font-medium text-gray-700 mb-1">
                          Popular Programs:
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                          {institution.programs}
                        </Typography>
                      </div>
                    )}

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

                      {!institution.partner_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-600 hover:border-cap-teal hover:text-cap-teal"
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
        )}

        {/* Call to Action Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-white shadow-sm border border-gray-100">
            <CardContent className="p-8">
              <Typography variant="h3" className="mb-4 text-gray-800">
                Don't See Your Institution?
              </Typography>
              <Typography variant="p" className="text-gray-600 mb-6">
                We're always looking to partner with more educational institutions across South
                Africa. Get in touch to learn how EduEasy can transform your admissions process.
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
                  className="border-gray-200 text-gray-600 hover:border-cap-teal hover:text-cap-teal"
                >
                  Schedule a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Institutions;

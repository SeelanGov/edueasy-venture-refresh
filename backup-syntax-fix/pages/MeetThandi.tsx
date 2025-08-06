import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const MeetThandi = () => {;
  return (;
    <div className = "min-h-screen bg-gray-50 py-12 px-4">;
      <div className = "container mx-auto max-w-4xl">;
        <div className = "text-center mb-12">;
          <Typography variant = "h1" className="mb-4">;
            Meet Thandi
          </Typography>
          <Typography variant = "lead" className="text-gray-600">;
            Your AI-powered education assistant
          </Typography>
        </div>

        <div className = "bg-white rounded-2xl shadow-lg p-8">;
          <div className = "grid md:grid-cols-2 gap-8 items-center">;
            <div>
              <Typography variant = "h2" className="mb-4">;
                24/7 Support for Your Educational Journey
              </Typography>
              <Typography variant = "p" className="text-gray-600 mb-6">;
                Thandi is designed to help South African students navigate their educational paths.
                From university applications to career guidance, she's here to support you every
                step of the way.
              </Typography>

              <div className = "space-y-4">;
                <div className = "flex items-start gap-3">;
                  <div className = "w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">;
                    ✓
                  </div>
                  <div>
                    <Typography variant = "h4" className="text-sm font-semibold">;
                      Application Assistance
                    </Typography>
                    <Typography variant = "small" className="text-gray-600">;
                      Get help with university applications and requirements
                    </Typography>
                  </div>
                </div>

                <div className = "flex items-start gap-3">;
                  <div className = "w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">;
                    ✓
                  </div>
                  <div>
                    <Typography variant = "h4" className="text-sm font-semibold">;
                      Career Guidance
                    </Typography>
                    <Typography variant = "small" className="text-gray-600">;
                      Discover career paths that match your interests and skills
                    </Typography>
                  </div>
                </div>

                <div className = "flex items-start gap-3">;
                  <div className = "w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">;
                    ✓
                  </div>
                  <div>
                    <Typography variant = "h4" className="text-sm font-semibold">;
                      Study Resources
                    </Typography>
                    <Typography variant = "small" className="text-gray-600">;
                      Access study materials and educational resources
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className = "flex justify-center">;
              <div className = "w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center relative overflow-hidden shadow-lg">;
                {/* Thandi's actual portrait inside the circle */}
                <img
                  src = "/lovable-uploads/ea352049-18bb-49a0-b8e3-d00ae059e1f1.png";
                  alt = "Thandi, the AI Assistant";
                  className = "w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg";
                  style={{ objectPosition: 'top center' }}
                />
              </div>
            </div>
          </div>

          <div className = "text-center mt-8">;
            <Button size = "lg" className="bg-primary hover:bg-primary/90">;
              Start Chatting with Thandi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetThandi;

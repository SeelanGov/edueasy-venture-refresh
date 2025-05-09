
import { CheckCircle } from "lucide-react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isActive?: boolean;
}

const Step = ({ number, title, description, isActive = false }: StepProps) => {
  return (
    <div className={`flex flex-col items-center ${isActive ? 'scale-105' : ''}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 
        ${isActive ? 'bg-cap-teal text-white' : 'bg-gray-100 text-cap-dark'}`}>
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 bg-cap-teal rounded"></div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            How EduEasy Works
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600">
            Your simplified journey to higher education in South Africa
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 md:gap-12 max-w-5xl mx-auto">
          <Step
            number={1}
            title="Create Account"
            description="Sign up and complete your student profile with personal details and academic records"
          />
          
          <Step
            number={2}
            title="Upload Documents"
            description="Submit your ID, academic results, and supporting documents securely"
            isActive={true}
          />
          
          <Step
            number={3}
            title="Apply to Programs"
            description="Select your desired institutions and programs with a single application"
          />
          
          <Step
            number={4}
            title="Track Progress"
            description="Monitor application status and receive updates in real-time"
          />
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="max-w-3xl bg-white rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Students who use EduEasy are 3x more likely to secure university placement</h3>
                <p className="mt-2 text-gray-600">
                  Our streamlined application process helps students apply to multiple institutions efficiently,
                  increasing their chances of acceptance. The verification process ensures your documents meet
                  all requirements before submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

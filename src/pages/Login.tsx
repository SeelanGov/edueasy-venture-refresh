
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Spinner } from "@/components/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PatternBorder } from "@/components/PatternBorder";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const { signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || "/dashboard";
  
  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      console.log("User already logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      console.log("Login successful, navigating to:", from);
      // Navigation will happen in the useEffect when user state updates
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cap-dark text-white">
      <div className="relative w-full">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            height: "180px",
          }}
        />
        <div className="relative z-10 pt-6 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-cap-teal p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Login to Your Account</h2>
            <p className="mt-2 text-sm opacity-90">Access your EduEasy dashboard</p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                          disabled={isLoading}
                          className="text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          type="password"
                          {...field}
                          disabled={isLoading}
                          className="text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-cap-coral hover:bg-cap-coral/90"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-cap-teal hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-white hover:text-cap-coral">
            ← Back to Home
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default Login;

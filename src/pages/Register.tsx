
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PatternBorder } from "@/components/PatternBorder";
import { Spinner } from "@/components/Spinner";

const registerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  idNumber: z
    .string()
    .length(13, "ID Number must be exactly 13 digits")
    .regex(/^\d+$/, "ID Number must contain only digits"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName, data.idNumber);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cap-dark text-white">
      {/* Header with Pattern */}
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
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <p className="mt-2 text-sm opacity-90">Get started with EduEasy today</p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
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
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">ID Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890123"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Confirm Password</FormLabel>
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
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-cap-teal hover:underline font-medium"
                    >
                      Sign in
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

      {/* Bottom Pattern */}
      <div className="absolute bottom-0 left-0 right-0">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default Register;

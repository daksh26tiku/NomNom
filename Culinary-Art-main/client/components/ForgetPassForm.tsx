"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/actions";
import { generateOTP } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter.",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number.",
  })
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message:
      "Password must contain at least one special character (e.g., !@#$%&*).",
  });

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email!"),
});

const verificationSchema = z.object({
  otp: z.string(),
});

const passwordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match. Please re-enter.",
    path: ["confirmPassword"],
  });

type emailFormData = z.infer<typeof emailSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ForgetPassForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formStage, setFormStage] = useState<"email" | "otp" | "password">(
    "email"
  );

  const [formData, setFormData] = useState<emailFormData | null>(null);
  const [generatedOTP, setGeneratedOTP] = useState<string>("");
  const [otpValue, setOtpValue] = useState("");
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();

  const emailForm = useForm<emailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onEmailSubmit = async (values: emailFormData) => {
    try {
      const otp = generateOTP();
      setGeneratedOTP(otp);
      setFormData(values);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/users/forget-password-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error("An Error Occurred", {
          description: `${data.message}`,
        });

        return;
      } else {
        setFormStage("otp");
        toast.success("Verification Code", {
          description: `${data.message}`,
        });
      }
    } catch (error) {
      toast.error("An Error Occurred", {
        description: `${(error as Error).message}`,
      });
    }
  };

  const onVerificationSubmit = async () => {
    try {
      if (otpValue !== generatedOTP) {
        toast.error("Error", {
          description: "Invalid verification code. Please try again.",
        });
        return;
      }

      if (!formData) {
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        });
        return;
      }

      setFormStage("password");

      setGeneratedOTP("");
      setOtpValue("");
      emailForm.reset();
      verificationForm.reset();
    } catch (error) {
      toast.error("Verification failed", {
        description: (error as Error).message,
      });
    }
  };

  const onPasswordSubmit = async (values: PasswordFormData) => {
    if (!formData) return;

    try {
      const submitFormData = {
        password: values.password,
        email: formData.email,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitFormData),
        }
      );

      const data = await response.json();

      if (data.success) {
        Cookies.set("session", data.token);

        const session = await getSession();

        if (session === null) throw new Error("Invalid Session");

        toast.success(
          `Logged in as ${(session.fullName as string).split(" ")[0]}`,
          {
            description: "Your account has been created successfully.",
          }
        );

        setFormData(null);
        setOtpValue("");
        emailForm.reset();
        verificationForm.reset();
        passwordForm.reset();

        setFormStage("email");

        //redirect
        if (session.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      } else {
        toast.error("Sign up failed", {
          description: data.message,
        });
        return;
      }
    } catch (error) {
      toast.error("Sign up failed", {
        description: (error as Error).message,
      });
    } finally {
      setFormStage("email");
    }
  };

  const resendVerificationCode = async () => {
    if (!formData) return;

    try {
      setIsResending(true);
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PREFIX}/users/forget-password-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: newOTP,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error("An Error Occurred", {
          description: `${data.message}`,
        });

        return;
      } else {
        setOtpValue("");
        verificationForm.reset();
        setFormStage("otp");
        toast.success("Verification Code Resent", {
          description: "Please check your email for the new verification code.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-sm mt-16">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-bold">
          {formStage === "email" && "Forgot Password"}
          {formStage === "otp" && "Verification"}
          {formStage === "password" && "Reset Password"}
        </CardTitle>
        <CardDescription>
          {formStage === "email" && "Enter your account email address"}
          {formStage === "otp" &&
            "Enter the verification code sent to your email"}
          {formStage === "password" && "Update your account information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formStage === "otp" && (
          <Form {...verificationForm}>
            <form
              onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}
              className="space-y-4"
            >
              <FormField
                control={verificationForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-col">
                    {/* <FormLabel className="hidden">Verification Code</FormLabel> */}
                    <FormControl>
                      <InputOTP
                        autoFocus
                        maxLength={6}
                        onChange={(value) => {
                          field.onChange(value);
                          setOtpValue(value);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="h-12 w-12 text-md"
                            index={0}
                          />
                          <InputOTPSlot
                            className="h-12 w-12 text-md"
                            index={1}
                          />
                          <InputOTPSlot
                            className="h-12 w-12 text-md"
                            index={2}
                          />
                          <InputOTPSeparator />
                          <InputOTPSlot
                            className="h-12 w-12 text-md"
                            index={3}
                          />
                          <InputOTPSlot
                            className="h-12 w-12 text-md"
                            index={4}
                          />
                          <InputOTPSlot
                            className="h-12 w-12 text-md"
                            index={5}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={verificationForm.formState.isSubmitting}
              >
                {verificationForm.formState.isSubmitting ? (
                  <>
                    <span className="">Verifying</span>
                    <span className="animate-spin">
                      <Loader2 className="h-4 w-4" />
                    </span>
                  </>
                ) : (
                  "Continue"
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant={"ghost"}
                  type="button"
                  onClick={resendVerificationCode}
                  disabled={
                    verificationForm.formState.isSubmitting || isResending
                  }
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <span className="">Sending code</span>
                      <span className="animate-spin">
                        <Loader2 className="h-4 w-4" />
                      </span>
                    </>
                  ) : (
                    "Resend verification code"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {formStage === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-6"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        type="email"
                        className="rounded-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting ? (
                  <>
                    <span>Sending otp</span>
                    <span className="animate-spin">
                      <Loader2 className="h-4 w-4" />
                    </span>
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>
        )}

        {formStage === "password" && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="mt-2 space-y-6"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••••••••••"
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="pr-10 rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••••••••••"
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10 rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? (
                  <>
                    <span>Updating & signing in</span>
                    <span className="animate-spin">
                      <Loader2 className="h-4 w-4" />
                    </span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </div> */}
      </CardContent>
    </Card>
  );
}

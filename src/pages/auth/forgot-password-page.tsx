import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth } from "@/lib/firebase";
import { cn, mapError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordPage: React.FC = () => {
  const [actionError, setActionError] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      const message = mapError(error);
      setActionError(message);
      toast.error(message);
    }

    form.reset();
    navigate("/auth/login");
  };
  return (
    <div className="m-auto aspect-video w-1/3 min-w-96">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="flex flex-col space-y-4">
            <CardHeader>
              <CardTitle>Reset your password</CardTitle>
            </CardHeader>
            <CardContent
              className={cn(
                "flex flex-col",
                actionError !== null ? "pb-0" : ""
              )}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <span>Email</span>
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info size={16} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>
                                We'll never share your email with anyone else.
                              </span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {actionError && (
                <span className="mx-auto pb-2 pt-4 text-red-700">
                  {actionError}
                </span>
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full">
                Reset password
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;

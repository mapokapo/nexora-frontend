import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface Props {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onSignInWithGoogle: () => void;
  actionError: string | null;
}

const LoginComponent: React.FC<Props> = ({
  onSubmit,
  onSignInWithGoogle,
  actionError,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="flex flex-col space-y-4">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent
            className={cn("flex flex-col", actionError !== null ? "pb-0" : "")}>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <span>Password</span>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={16} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>
                              Password must be at least 8 characters long.
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
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
          <CardFooter className="mt-2 flex flex-col pb-0">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full">
              Sign in
            </Button>
            <div className="mt-2 flex w-full justify-between gap-1 px-2 py-1">
              <Button
                type="button"
                variant="link"
                disabled={form.formState.isSubmitting}
                className="px-0"
                asChild>
                <Link to="/auth/forgot-password">Forgot password?</Link>
              </Button>
              <Button
                type="button"
                variant="link"
                disabled={form.formState.isSubmitting}
                className="px-0"
                asChild>
                <Link to="/auth/register">Don't have an account?</Link>
              </Button>
            </div>
          </CardFooter>
          <div className="relative mx-auto w-11/12">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-default bg-background px-2 uppercase text-muted-foreground/40">
              or
            </span>
          </div>
          <div className="flex items-center justify-center p-8 pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={form.formState.isSubmitting}
              onClick={onSignInWithGoogle}>
              <span className="ml-2">Sign in with Google</span>
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default LoginComponent;

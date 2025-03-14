import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

interface Props {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  actionError: string | null;
}

const CreateProfileComponent: React.FC<Props> = ({ onSubmit, actionError }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(values => {
          onSubmit({ ...values });
        })}>
        <Card className="flex flex-col space-y-4">
          <CardHeader>
            <CardTitle>Create your profile</CardTitle>
          </CardHeader>
          <CardContent
            className={cn("flex flex-col", actionError !== null ? "pb-0" : "")}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
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
          <CardFooter className="mt-2 flex flex-col pb-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}>
              Create profile
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateProfileComponent;

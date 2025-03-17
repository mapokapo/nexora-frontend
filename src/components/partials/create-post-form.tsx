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
import { Textarea } from "@/components/ui/textarea";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import { cn, mapError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  content: z.string().min(1, "Post content is required"),
});

const CreatePostForm: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const user = useAppUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addDoc(collection(firestore, "posts"), {
        title: values.title.trim(),
        content: values.content.trim(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        userId: user.uid,
      });

      form.reset();
      setIsOpened(false);
    } catch (error) {
      const message = mapError(error);
      setActionError(message);
      toast.error(message);
    }
  };

  return isOpened ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="m-2 flex flex-col space-y-2 border-none">
          <CardHeader>
            <CardTitle>Create a new post</CardTitle>
          </CardHeader>
          <CardContent
            className={cn("flex flex-col", actionError !== null ? "pb-0" : "")}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Content"
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
              Create post
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  ) : (
    <div className="p-2">
      <Button
        className="w-full"
        onClick={() => setIsOpened(true)}
        variant="outline">
        Create a new post
      </Button>
    </div>
  );
};

export default CreatePostForm;

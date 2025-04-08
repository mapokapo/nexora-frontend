import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { firestore } from "@/lib/firebase";
import { useAppUser } from "@/lib/hooks/use-user";
import { Post } from "@/lib/types/Post";
import { cn, mapError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CreateCommentFormProps {
  post: Post;
}

const formSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ post }) => {
  const [actionError, setActionError] = useState<string | null>(null);

  const user = useAppUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addDoc(collection(firestore, "comments"), {
        content: values.content.trim(),
        userId: user.uid,
        postId: post.id,
      });

      form.reset();
      setActionError(null);
    } catch (error) {
      const message = mapError(error);
      setActionError(message);
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-2"
        onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            "flex w-full flex-col",
            actionError !== null ? "pb-0" : ""
          )}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Comment content"
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
        </div>
        <Button
          className="aspect-square"
          variant="ghost"
          size="icon"
          type="submit"
          disabled={form.formState.isSubmitting}>
          <Send />
        </Button>
      </form>
    </Form>
  );
};

export default CreateCommentForm;

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <Button
        onClick={() => {
          void navigate(-1);
        }}
        className="mt-4">
        Go back
      </Button>
    </div>
  );
};

export default NotFoundPage;

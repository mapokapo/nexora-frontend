import ErrorComponent from "@/components/partials/error-component";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <ErrorComponent
        title="404 Not Found"
        message="The page you are looking for does not exist."
        action="go-back"
      />
    </div>
  );
};

export default NotFoundPage;

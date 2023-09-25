import { Link } from "react-router-dom";
import Container from "../../../components/ui/Container";

const NotFound = () => {
  return (
    <Container
      containerClass="w-full grid place-items-center"
      tabTitle="Not Found"
    >
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white-powder dark:text-purple-eminence">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-white-powder md:text-4xl">
            Something's missing
          </p>
          <p className="mb-4 text-lg text-white-powder">
            Sorry, we can't find that page
          </p>
          <Link
            to="/"
            className="inline-flex text-slate-50 bg-purple-eminence hover:bg-purple-eminence focus:ring-1 focus:outline-none focus:ring-purple-eminence font-medium rounded-lg text-sm px-5 py-2.5 text-center4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;

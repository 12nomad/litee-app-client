import Spinner from "./Spinner";

interface ILoading {
  withNav?: boolean;
}

const Loading = ({ withNav = true }: ILoading) => {
  return (
    <div
      className={`w-full grid place-items-center ${
        withNav ? "h-full" : "h-screen"
      }`}
    >
      <Spinner lg={true} />
    </div>
  );
};

export default Loading;

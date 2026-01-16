const Loader = () => {
  return (
    <div className="fixed inset-0  flex align-items-center justify-content-center bg-white h-screen w-screen z-3">
      <img
        className="h-4rem"
        src="/loader.gif"
        alt="Loading..."
      />
    </div>
  );
};

export default Loader;

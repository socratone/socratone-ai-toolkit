import Link from 'next/link';

const Home = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col text-lg">
        <Link className="text-center py-1 px-2 font-semibold" href="/chat">
          Chat
        </Link>
        <Link className="text-center py-1 px-2 font-semibold" href="/pdf">
          Pdf
        </Link>
      </div>
    </div>
  );
};

export default Home;

import Link from 'next/link';

const Home = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col space-y-4">
        <Link href="/chat">Chat</Link>
        <Link href="/pdf">Pdf</Link>
      </div>
    </div>
  );
};

export default Home;

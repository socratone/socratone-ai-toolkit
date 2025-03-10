import Link from 'next/link';
import MenuIcon from './icons/MenuIcon';
import HomeIcon from './icons/HomeIcon';

interface HeaderProps {
  onOpenMenu?: () => void;
  isMenu?: boolean;
  isHome?: boolean;
  children?: React.ReactNode;
}

const Header = ({ onOpenMenu, isMenu, isHome, children }: HeaderProps) => {
  return (
    <header className="flex justify-between gap-1 sticky top-0 bg-white px-3 py-2 border-gray-200 border-b z-30">
      <nav className="flex items-center">
        {isMenu && onOpenMenu ? (
          <button
            className="flex justify-center items-center size-10"
            onClick={onOpenMenu}
          >
            <MenuIcon />
          </button>
        ) : null}
        {isHome ? (
          <Link href="/" className="flex justify-center items-center size-10">
            <HomeIcon />
          </Link>
        ) : null}
        <Link className="text-center py-1 px-2 font-semibold" href="/chat">
          Chat
        </Link>
        <Link className="text-center py-1 px-2 font-semibold" href="/pdf">
          Pdf
        </Link>
        <Link className="text-center py-1 px-2 font-semibold" href="/youtube">
          Youtube
        </Link>
      </nav>
      {children ? <div className="flex items-center">{children}</div> : null}
    </header>
  );
};

export default Header;

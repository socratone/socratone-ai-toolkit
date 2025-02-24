import Link from 'next/link';
import MenuIcon from './icons/MenuIcon';
import HomeIcon from './icons/HomeIcon';

interface HeaderProps {
  onOpenMenu?: () => void;
}

const Header = ({ onOpenMenu }: HeaderProps) => {
  return (
    <header className="flex justify-between gap-1 sticky top-0 bg-white px-3 py-2 border-gray-200 border-b">
      <div className="flex items-center">
        {onOpenMenu ? (
          <button
            className="flex justify-center items-center size-10"
            onClick={onOpenMenu}
          >
            <MenuIcon />
          </button>
        ) : null}
        <Link href="/" className="flex justify-center items-center size-10">
          <HomeIcon />
        </Link>
      </div>
    </header>
  );
};

export default Header;

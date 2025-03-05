interface CopyButtonProps {
  onClick: () => void;
}

const CopyIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M15 20H5V7c0-.55-.45-1-1-1s-1 .45-1 1v13c0 1.1.9 2 2 2h10c.55 0 1-.45 1-1s-.45-1-1-1zm5-4V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2zm-2 0H9V4h9v12z"></path>
    </svg>
  );
};

const CopyButton = ({ onClick }: CopyButtonProps) => {
  return (
    <button
      className="ml-auto mb-2 rounded-md border border-gray-300 text-gray-400 text-xs px-2 py-1 flex items-center gap-1 font-bold"
      onClick={onClick}
    >
      <CopyIcon />
      코드 복사
    </button>
  );
};

export default CopyButton;

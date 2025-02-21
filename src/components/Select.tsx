import { cn } from '@/utils/cn';
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: Option[];
  fullWidth?: boolean;
  maxWidth?: number;
}

const Select = <T,>({
  value,
  onChange,
  options,
  fullWidth,
  maxWidth,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={cn('relative inline-block w-48', {
        'w-full': fullWidth,
      })}
      style={{
        maxWidth,
      }}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full bg-white border border-gray-200 hover:border-black px-3 py-2 rounded-md flex justify-between items-center focus:outline-none"
      >
        <span>{selectedOption?.label ?? '없음'}</span>
        <svg
          className={`fill-current h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M10 12l-6-6h12z" />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value as T);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;

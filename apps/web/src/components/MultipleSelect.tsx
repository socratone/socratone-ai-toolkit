import { cn } from '@/utils/cn';
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultipleSelectProps {
  /**
   * 선택된 값들의 배열
   */
  values: string[];
  /**
   * 값이 변경될 때 호출되는 콜백 함수
   */
  onChange: (values: string[]) => void;
  /**
   * 선택 가능한 옵션들의 배열
   */
  options: Option[];
  /**
   * 컴포넌트의 너비를 100%로 설정
   */
  fullWidth?: boolean;
  /**
   * 컴포넌트의 최대 너비
   */
  maxWidth?: number;
}

/**
 * 다중 선택이 가능한 Select 컴포넌트
 */
const MultipleSelect = ({
  values,
  onChange,
  options,
  fullWidth,
  maxWidth,
}: MultipleSelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((option) => values.includes(option.value));

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

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
        <span>
          {selectedOptions.length > 0
            ? selectedOptions.map((option) => option.label).join(', ')
            : '없음'}
        </span>
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
              onClick={() => handleOptionClick(option.value)}
              className={cn('px-4 py-2 hover:bg-gray-100 cursor-pointer', {
                'bg-blue-50': values.includes(option.value),
              })}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultipleSelect;

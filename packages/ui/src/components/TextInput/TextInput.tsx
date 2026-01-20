import React from 'react';
import { cn } from '../../utils/cn';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  maxWidth?: number;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, disabled, fullWidth, maxWidth, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        disabled={disabled}
        style={{
          maxWidth,
        }}
        className={cn(
          'border rounded-lg p-2 focus:border-gray-600 focus:outline-none',
          {
            'bg-gray-200 cursor-not-allowed border-gray-200 focus:border-gray-200 text-white':
              disabled,
            'w-full': fullWidth,
          },
          className
        )}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;

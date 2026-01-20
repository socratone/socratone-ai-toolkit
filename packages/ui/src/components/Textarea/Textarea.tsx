import React from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disabled, fullWidth, ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        disabled={disabled}
        className={cn(
          'border rounded-lg p-2 resize-none h-full focus:border-gray-600 focus:outline-none',
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

Textarea.displayName = 'Textarea';

export default Textarea;

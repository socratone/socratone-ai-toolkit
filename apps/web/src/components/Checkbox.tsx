import { cn } from '@/utils/cn';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const Checkbox = ({
  checked,
  onCheckedChange,
  label,
  className,
}: CheckboxProps) => {
  return (
    <label className={cn('inline-flex items-center cursor-pointer', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      {label ? <span className="ml-1 cursor-pointer">{label}</span> : null}
    </label>
  );
};

export default Checkbox;

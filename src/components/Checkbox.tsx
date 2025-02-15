interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

const Checkbox = ({ checked, onCheckedChange, label }: CheckboxProps) => {
  return (
    <label className="inline-flex items-center">
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      {label ? <span className="ml-1 cursor-pointer">{label}</span> : null}
    </label>
  );
};

export default Checkbox;

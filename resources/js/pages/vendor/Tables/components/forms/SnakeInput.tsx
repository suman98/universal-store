import { useState } from "react";
import { Input } from '@/components/ui/input';
const SnakeCaseInput = ({ onChange, placeholder = "snake_case_only", ...props }) => {
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleChange = (e: { target: { value: any; }; }) => {
    const raw = e.target.value;

    // Block spaces entirely — don't update input
    if (raw.includes(" ")) {
      setHasError(true);
      return;
    }

    setHasError(false);
    setValue(raw);
    onChange?.(raw);
  };

  return (
    <Input
      {...props}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`
        ${
          hasError
            ? "border-red-500 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        }
      `}
    />
  );
};

export default SnakeCaseInput;

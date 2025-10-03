import { DefaultInput } from "../DefaultInput";

type FormInputProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FormInput({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
}: FormInputProps) {
  return (
    <DefaultInput
      id={id}
      labelInline={false}
      labelText={label}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
}

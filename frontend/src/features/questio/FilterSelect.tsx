import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';

type FilterOption = { value: string; label: string };
type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const selected = options.find(option => option.value === value);
  return <DropdownMenu.Root>
    <DropdownMenu.Trigger className="filter-field" aria-label={`${label}: ${selected?.label || value}`}>
      <span>{selected?.label || value}</span><ChevronDown size={16} aria-hidden="true" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="filter-menu" align="start" sideOffset={6} collisionPadding={12} aria-label={label}>
        <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
          {options.map(option => <DropdownMenu.RadioItem className="filter-option" key={option.value} value={option.value}>
            <span>{option.label}</span><DropdownMenu.ItemIndicator><Check size={16} aria-hidden="true" /></DropdownMenu.ItemIndicator>
          </DropdownMenu.RadioItem>)}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>;
}

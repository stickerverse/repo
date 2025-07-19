'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';

type LaminationSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const options = ['Yes', 'No'];

export function LaminationSelector({ value, onValueChange }: LaminationSelectorProps) {
  return (
    <div>
      <Label className="text-xl font-black text-white mb-3 block">Lamination</Label>
      <Select onValueChange={onValueChange} defaultValue={value}>
        <SelectTrigger className="w-full bg-white/20 border-white/30 text-white rounded-lg p-4 h-auto focus:ring-cyan-400">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

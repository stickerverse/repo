'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';

type FinishSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const finishes = ['Glossy', 'Matte', 'Cracked Ice'];

export function FinishSelector({ value, onValueChange }: FinishSelectorProps) {
  return (
    <div>
        <Label className="text-xl font-black text-white mb-3 block">Finish</Label>
        <Select onValueChange={onValueChange} defaultValue={value}>
            <SelectTrigger className="w-full bg-white/20 border-white/30 text-white rounded-lg p-4 h-auto focus:ring-cyan-400">
            <SelectValue placeholder="Select a finish" />
            </SelectTrigger>
            <SelectContent>
            {finishes.map((finish) => (
                <SelectItem key={finish} value={finish}>
                {finish}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    </div>
  );
}

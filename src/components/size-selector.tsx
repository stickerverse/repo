'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SizeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const sizes = [
    '2" x 2"',
    '3" x 3"',
    '4" x 4"',
    '5" x 5"',
    '6" x 6"',
    '7" x 7"',
    '8" x 8"',
    '9" x 9"',
    '10" x 10"',
    'Custom size',
];

export function SizeSelector({ value, onValueChange }: SizeSelectorProps) {
  return (
    <div>
      <h3 className="text-xl font-black text-white mb-3">Size, inch (WxH)</h3>
      <RadioGroup value={value} onValueChange={onValueChange} className="bg-white/10 rounded-lg border border-white/20">
        {sizes.map((size, index) => (
          <Label
            key={size}
            htmlFor={`size-${size.replace(/\s/g, '-')}`}
            className={cn(
              'flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-white/20',
              value === size ? 'bg-white/20 font-extrabold text-cyan-400' : 'font-normal',
              index > 0 && 'border-t border-white/20'
            )}
          >
            <span className="flex-1 text-white ml-3">{size}</span>
            <RadioGroupItem value={size} id={`size-${size.replace(/\s/g, '-')}`} className="sr-only" />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

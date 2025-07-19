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
      <h3 className="text-xl font-black text-gray-800 mb-3">Size, inch (WxH)</h3>
      <RadioGroup value={value} onValueChange={onValueChange} className="bg-white rounded-lg border border-gray-200">
        {sizes.map((size, index) => (
          <Label
            key={size}
            htmlFor={`size-${size.replace(/\s/g, '-')}`}
            className={cn(
              'flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50',
              value === size ? 'bg-gray-100 font-extrabold' : 'font-normal',
              index > 0 && 'border-t border-gray-200'
            )}
          >
            <span className="flex-1 text-gray-800 ml-3">{size}</span>
            <RadioGroupItem value={size} id={`size-${size.replace(/\s/g, '-')}`} className="sr-only" />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

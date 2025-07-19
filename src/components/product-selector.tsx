'use client';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';

type ProductSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const products = [
    'Die Cut Sticker',
    'Sticker Sheet',
    'Kiss Cut Sheet',
    'Hang Tag Sticker',
    'Epoxy 3D Sticker',
    'Front Adhesive Sticker',
    'Heavy Duty Sticker',
    'Wall Sticker',
    'Removable Sticker',
    'Floor Sticker',
];

export function ProductSelector({ value, onValueChange }: ProductSelectorProps) {
  return (
    <div>
        <Label className="text-xl font-black text-white mb-3 block">Product</Label>
        <Select onValueChange={onValueChange} defaultValue={value}>
            <SelectTrigger className="w-full bg-white/20 border-white/30 text-white rounded-lg p-4 h-auto focus:ring-cyan-400">
            <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
            {products.map((product) => (
                <SelectItem key={product} value={product}>
                {product}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    </div>
  );
}

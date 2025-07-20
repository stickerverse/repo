
'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid3X3 } from 'lucide-react';
import type { GridOption } from './sticker-canvas';

type GridSelectorProps = {
  maxRows?: number;
  maxCols?: number;
  value: GridOption;
  onValueChange: (value: GridOption) => void;
};

export function GridSelector({ maxRows = 5, maxCols = 5, value, onValueChange }: GridSelectorProps) {
  const [hovered, setHovered] = useState({ row: -1, col: -1 });
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (row: number, col: number) => {
    onValueChange((row + 1) * (col + 1));
    setIsOpen(false);
  };
  
  const getRowsFromValue = (v: GridOption) => {
    if (v <= maxCols) return 1;
    for (let i = Math.floor(Math.sqrt(v)); i > 0; i--) {
        if (v % i === 0 && (v/i) <= maxCols) {
            return i;
        }
    }
    return Math.ceil(v / maxCols);
  }

  const selectedRows = getRowsFromValue(value);
  const selectedCols = value / selectedRows;


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <Grid3X3 className="mr-2 h-4 w-4" />
          <span>{`${selectedCols} x ${selectedRows} (${value} stickers)`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-secondary border-border" align="start">
        <div 
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
          }}
          onMouseLeave={() => setHovered({ row: -1, col: -1 })}
        >
          {Array.from({ length: maxRows }).map((_, rowIndex) =>
            Array.from({ length: maxCols }).map((_, colIndex) => {
              const isHighlighted = rowIndex <= hovered.row && colIndex <= hovered.col;
              const isSelected = rowIndex < selectedRows && colIndex < selectedCols;
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "w-6 h-6 border border-border rounded-sm transition-colors cursor-pointer",
                    isHighlighted ? "bg-accent" : "bg-card/50",
                    isSelected && !isHighlighted && "bg-accent/50",
                  )}
                  onMouseEnter={() => setHovered({ row: rowIndex, col: colIndex })}
                  onClick={() => handleSelect(rowIndex, colIndex)}
                />
              );
            })
          )}
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">
          {hovered.row !== -1
            ? `${hovered.col + 1} x ${hovered.row + 1} (${(hovered.col + 1) * (hovered.row + 1)} stickers)`
            : 'Select grid size'}
        </div>
      </PopoverContent>
    </Popover>
  );
}

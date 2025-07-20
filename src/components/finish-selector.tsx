'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle, Sparkles, Shield, Droplets } from 'lucide-react';

export type VinylFinish = {
  name: string;
  description: string;
  properties: string[];
  durability: number;
  price: number;
  visual: {
    gradient: string;
    overlay: string;
    animation?: string;
  };
};

type FinishSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const vinylFinishes: VinylFinish[] = [
  {
    name: 'Gloss',
    description: 'High-shine finish with vibrant colors',
    properties: ['UV Resistant', 'Scratch Resistant', 'Easy to Clean'],
    durability: 5,
    price: 1.0,
    visual: {
      gradient: 'bg-gradient-to-br from-white/20 via-transparent to-white/10',
      overlay: 'shadow-lg shadow-white/20',
      animation: 'animate-pulse'
    }
  },
  {
    name: 'Matte',
    description: 'Elegant non-reflective finish',
    properties: ['Fingerprint Resistant', 'Premium Feel', 'Subtle Texture'],
    durability: 4,
    price: 1.2,
    visual: {
      gradient: 'bg-gradient-to-br from-gray-800/30 to-gray-900/20',
      overlay: 'shadow-md',
    }
  },
  {
    name: 'Holographic',
    description: 'Rainbow iridescent effect',
    properties: ['Eye-Catching', 'Color Shifting', 'Premium Appeal'],
    durability: 4,
    price: 2.5,
    visual: {
      gradient: 'bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-cyan-400/30',
      overlay: 'shadow-xl shadow-purple-500/20',
      animation: 'animate-pulse'
    }
  },
  {
    name: 'Transparent',
    description: 'Clear vinyl showing background',
    properties: ['See-Through', 'Versatile', 'Modern Look'],
    durability: 3,
    price: 1.8,
    visual: {
      gradient: 'bg-gradient-to-br from-white/5 to-white/1',
      overlay: 'border-2 border-white/20',
    }
  },
  {
    name: 'Weatherproof',
    description: 'Heavy-duty outdoor rated vinyl',
    properties: ['Waterproof', 'UV Protected', '5+ Year Lifespan'],
    durability: 5,
    price: 1.5,
    visual: {
      gradient: 'bg-gradient-to-br from-blue-900/30 to-green-900/20',
      overlay: 'shadow-lg border border-blue-500/30',
    }
  },
  {
    name: 'Metallic',
    description: 'Shimmering metallic finish',
    properties: ['Reflective', 'Luxury Feel', 'Premium Quality'],
    durability: 4,
    price: 2.0,
    visual: {
      gradient: 'bg-gradient-to-br from-yellow-400/20 via-yellow-600/15 to-yellow-800/20',
      overlay: 'shadow-lg shadow-yellow-500/20',
      animation: 'animate-bounce'
    }
  }
];

export function FinishSelector({ value, onValueChange }: FinishSelectorProps) {
  const selectedFinish = vinylFinishes.find(f => f.name === value);

  return (
    <div className="space-y-4">
      <Label className="text-xl font-black text-white mb-3 block">Vinyl Finish</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vinylFinishes.map((finish) => {
          const isSelected = value === finish.name;
          
          return (
            <Card
              key={finish.name}
              onClick={() => onValueChange(finish.name)}
              className={cn(
                'cursor-pointer transition-all duration-300 group border rounded-xl relative backdrop-blur-sm overflow-hidden',
                isSelected
                  ? 'border-accent ring-2 ring-accent/50 bg-gradient-to-br from-accent/20 to-accent/10 shadow-xl shadow-accent/20'
                  : 'border-border bg-card/50 hover:bg-card/80 hover:border-accent/40 hover:shadow-lg',
                'min-w-0 max-w-full h-24'
              )}
            >
              {/* Visual Simulation Background */}
              <div className={cn(
                'absolute inset-0 transition-all duration-500',
                finish.visual.gradient,
                finish.visual.overlay,
                finish.visual.animation && isSelected ? finish.visual.animation : ''
              )} />
              
              {/* Holographic Animation */}
              {finish.name === 'Holographic' && isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
              
              {isSelected && (
                <div className="absolute top-1 right-1 z-10">
                  <CheckCircle className="h-4 w-4 text-accent fill-accent/20" />
                </div>
              )}
              
              <CardContent className="p-3 flex flex-col justify-between h-full relative z-10">
                <div>
                  <h3 className={cn(
                    'font-semibold text-sm transition-colors duration-200 mb-1',
                    isSelected 
                      ? 'font-extrabold text-accent' 
                      : 'text-foreground group-hover:text-accent'
                  )}>
                    {finish.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {finish.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    {Array.from({ length: finish.durability }).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-accent rounded-full" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-accent">
                    {finish.price === 1.0 ? 'Base' : `+${Math.round((finish.price - 1) * 100)}%`}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Finish Details */}
      {selectedFinish && (
        <Card className="bg-card/60 border-accent/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  {selectedFinish.name} Vinyl Properties
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFinish.properties.map((property, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {property}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <Shield className="h-3 w-3 text-accent" />
                  <span className="text-muted-foreground">Durability:</span>
                  <span className="font-medium text-foreground">
                    {selectedFinish.durability}/5
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Droplets className="h-3 w-3 text-accent" />
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium text-foreground">
                    {selectedFinish.price === 1.0 ? 'Standard' : `+${Math.round((selectedFinish.price - 1) * 100)}%`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

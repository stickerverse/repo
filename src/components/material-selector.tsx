'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, Sparkles, Eye, Zap, Star } from 'lucide-react';

type MaterialSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const materials = [
  { 
    name: 'Vinyl', 
    image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/06/08/4d0ae46e9e164daa9171d70e51cd46c7acaa2419.png',
    description: 'Smooth, durable finish',
    premium: false,
    icon: null
  },
  { 
    name: 'Holographic', 
    image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/48e2c5c8c6ab57d013675b3b245daa2136e0c7cf.png',
    description: 'Rainbow reflective effect',
    premium: true,
    icon: Zap
  },
  { 
    name: 'Transparent', 
    image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/2d46e2873ec899b83a152c2f2ad52c1368398333.png',
    description: 'See-through clear finish',
    premium: false,
    icon: Eye
  },
  { 
    name: 'Glitter', 
    image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/8d48777356c014861f8e174949f2a382778c0a7e.png',
    description: 'Sparkling texture',
    premium: true,
    icon: Sparkles
  },
  { 
    name: 'Mirror', 
    image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/c5e0f009dbf3aec33b2e8d0caac5ebcd1a10348f.png',
    description: 'High-gloss reflective',
    premium: true,
    icon: null
  },
  { 
    name: 'Pixie Dust', 
    image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/08/23/46dac2bd418951b1412d4225cbdaad579aed03e4.png',
    description: 'Magical shimmer effect',
    premium: true,
    icon: Sparkles
  },
];

export function MaterialSelector({ value, onValueChange }: MaterialSelectorProps) {
  const [hoveredMaterial, setHoveredMaterial] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xl font-black text-foreground flex items-center gap-2">
          Material
        </Label>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Star className="h-3 w-3 text-accent" />
          {materials.filter(m => m.premium).length} Premium Options
        </div>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
        {materials.map((material) => {
          const IconComponent = material.icon;
          const isSelected = value === material.name;
          const isHovered = hoveredMaterial === material.name;
          
          return (
            <div key={material.name} className="relative">
              <Card
                onClick={() => onValueChange(material.name)}
                onMouseEnter={() => setHoveredMaterial(material.name)}
                onMouseLeave={() => setHoveredMaterial(null)}
                className={cn(
                  'cursor-pointer transition-all duration-300 group border rounded-xl overflow-hidden relative backdrop-blur-sm',
                  isSelected
                    ? 'border-accent ring-2 ring-accent/50 bg-gradient-to-br from-accent/20 to-accent/10 shadow-xl shadow-accent/20 animated-gradient-border'
                    : 'border-border bg-card/50 hover:bg-card/80 hover:border-accent/40 hover:shadow-lg',
                  'min-w-0 max-w-full'
                )}
              >
                {/* Premium Badge */}
                {material.premium && (
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-lg">
                      PRO
                    </div>
                  </div>
                )}

                {/* Selection Check */}
                {isSelected && (
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent fill-accent/20" />
                  </div>
                )}

                <div className="flex flex-col items-center justify-center p-2 sm:p-4 h-full min-h-[120px] sm:min-h-[140px]">
                  {/* Image Container */}
                  <div className={cn(
                    "relative w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3 overflow-hidden rounded-lg transition-transform duration-300",
                    isHovered && "scale-110",
                    isSelected && "ring-2 ring-accent/30"
                  )}>
                    <img
                      src={material.image}
                      alt={material.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-1">
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 text-accent animate-pulse" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Material Name */}
                  <h3 className={cn(
                    'font-semibold text-center text-xs sm:text-sm transition-colors duration-200 line-clamp-1',
                    isSelected 
                      ? 'font-extrabold text-accent' 
                      : 'text-foreground group-hover:text-accent'
                  )}>
                    {material.name}
                  </h3>

                  {/* Description */}
                  <p className={cn(
                    'text-xs text-center mt-1 transition-all duration-200 line-clamp-2 hidden sm:block',
                    isSelected 
                      ? 'text-accent/80 opacity-100' 
                      : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                  )}>
                    {material.description}
                  </p>
                </div>

                {/* Animated Border Effect for Selected */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl border-2 border-accent animate-pulse pointer-events-none" />
                )}
              </Card>
            </div>
          );
        })}
      </div>

      {/* Material Info */}
      {hoveredMaterial && (
        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-3 transition-all duration-300 animated-gradient-border-on-hover">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{hoveredMaterial}</h4>
            {materials.find(m => m.name === hoveredMaterial)?.premium && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                PRO
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {materials.find(m => m.name === hoveredMaterial)?.description}
          </p>
        </div>
      )}

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-accent\\/20::-webkit-scrollbar-thumb {
          background-color: hsl(var(--accent) / 0.2);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        /* Additional starfield effect for premium materials */
        .premium-sparkle::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(1px 1px at 10px 15px, hsl(var(--accent)), transparent),
            radial-gradient(1px 1px at 25px 35px, hsl(var(--accent)), transparent),
            radial-gradient(1px 1px at 40px 10px, hsl(var(--accent)), transparent);
          background-size: 50px 50px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .premium-sparkle:hover::before {
          opacity: 0.3;
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
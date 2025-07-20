'use client';

import React, from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { UploadCloud, X, Image, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EditorPanel } from './editor-panel';
import type { SizeOption as SheetSizeOption } from './size-selector';
import { cn } from '@/lib/utils';

type StickerCanvasProps = {
  files: FileWithPath[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
  sizeOption: SheetSizeOption;
  gridOption: GridOption;
  product: string;
};

export type GridOption = number;

interface FileWithPreview extends FileWithPath {
  preview?: string;
}

export function StickerCanvas({ files, setFiles, sizeOption, gridOption, product }: StickerCanvasProps) {
  const { toast } = useToast();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const imageRef = React.useRef<HTMLDivElement>(null);

  const getGridLayout = React.useCallback((count: GridOption) => {
    if (count <= 1) return { cols: 1, rows: 1 };
  
    const factors = [];
    for (let i = 1; i <= Math.sqrt(count); i++) {
        if (count % i === 0) {
            factors.push([i, count / i]);
        }
    }

    if (factors.length === 0) return { cols: count, rows: 1};

    let bestFactors = factors[factors.length -1];
    
    const isVertical = sizeOption === 'Vertical Sheet';
    
    if (isVertical) {
      return { cols: Math.min(bestFactors[0], bestFactors[1]), rows: Math.max(bestFactors[0], bestFactors[1]) };
    } else {
      return { cols: Math.max(bestFactors[0], bestFactors[1]), rows: Math.min(bestFactors[0], bestFactors[1]) };
    }
  }, [sizeOption]);

  const isSheet = product === 'Sticker Sheet';
  const currentGridOption = isSheet ? gridOption : 1;

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Only PNG files are accepted. Please try again.',
        });
        return;
      }
      
      const maxFiles = currentGridOption;
      let existingFilesCount = files.length;
      const filesToProcess = acceptedFiles.slice(0, maxFiles - existingFilesCount);
      
      const newFiles = filesToProcess.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles(prevFiles => [...prevFiles, ...newFiles]);

      if (!isSheet) {
        setPosition({ x: 0, y: 0 });
        setScale(100);
        setRotation(0);
      }
    },
    [setFiles, toast, currentGridOption, files.length, isSheet]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    maxFiles: isSheet ? currentGridOption - files.length : 1 - files.length,
    multiple: isSheet,
    noClick: files.length >= currentGridOption,
    noKeyboard: files.length >= currentGridOption,
  });

  const removeFile = React.useCallback((indexToRemove?: number) => {
    if (indexToRemove !== undefined) {
      const fileToRemove = files[indexToRemove];
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setFiles(files.filter((_, i) => i !== indexToRemove));
    } else {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles([]);
    }
  }, [files, setFiles]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const filePreview = React.useMemo(() => {
    if (files.length === 0 && !isSheet) return null;
    
    if (!isSheet && files[0]?.preview) {
      return (
        <div 
          ref={imageRef}
          className="absolute group cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale / 100})`,
          }}
          onMouseDown={handleMouseDown}
        >
          <img
            src={files[0].preview}
            alt={files[0].name}
            className="max-w-full max-h-full object-contain pointer-events-none"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0 z-20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    if (isSheet) {
      const { cols, rows } = getGridLayout(gridOption);
      
      return (
        <div className="absolute inset-4 grid gap-2" style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}>
          {Array.from({ length: gridOption }).map((_, index) => {
            const file = files[index];
            return (
              <div
                key={index}
                className={cn('relative border-2 border-dashed border-border/30 rounded-lg flex items-center justify-center group', {
                  'bg-card/50': file,
                  'bg-muted/20': !file,
                })}
              >
                {file?.preview ? (
                  <>
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="max-w-full max-h-full object-contain p-1"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 z-20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                   <div {...getRootProps({ className: 'w-full h-full' })}>
                    <div className="text-center text-muted-foreground text-xs flex flex-col items-center justify-center h-full cursor-pointer hover:bg-accent/10 rounded-lg">
                      <div className="w-8 h-8 mx-auto mb-1 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                        <Image className="w-4 h-4 text-muted-foreground" />
                      </div>
                      Drop image
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    
    return null;
  }, [files, isSheet, position, rotation, scale, gridOption, getGridLayout, removeFile, getRootProps]);

  const getCanvasAspect = () => {
    if (!isSheet) return 'aspect-square';
    if (sizeOption === 'Vertical Sheet') {
      return 'aspect-[3/4]';
    }
    return 'aspect-video';
  };

  return (
    <div className="space-y-6">
      <div className={cn("relative w-full h-[700px] bg-card/80 border-dashed border-2 border-border hover:border-accent transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden shadow-2xl rounded-lg", getCanvasAspect())}>
      <div className="absolute inset-0 stars opacity-100 pointer-events-none" />
      
      <div {...getRootProps({ 
        className: cn('w-full h-full flex items-center justify-center transition-all duration-300', {
          'bg-accent/10 scale-105': isDragActive,
          'cursor-pointer': files.length === 0 && !isSheet
        }) 
      })}>
        <input {...getInputProps()} id="file-upload-input" />
        
        {files.length < currentGridOption && !isSheet && (
          <div className="text-center p-8 text-muted-foreground relative z-10">
            <div className="relative mb-6">
              <UploadCloud className={cn('mx-auto h-16 w-16 mb-4 text-accent transition-all duration-300', {
                'scale-110 animate-bounce': isDragActive
              })} />
              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-accent animate-spin" />
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-lg text-foreground mb-2">
              {isDragActive ? 'Drop your design here!' : 'Upload Your Design'}
            </h3>
            
            <p className="text-base mb-4">
              {isDragActive 
                ? 'Release to upload your file' 
                : "Drag 'n' drop a PNG file here, or click to select"
              }
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-accent" />
                <span>PNG format</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                <span>Transparent backgrounds</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground font-medium mb-2">💡 Pro Tips:</p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Use high-resolution PNG files (300+ DPI)</li>
                <li>• Transparent backgrounds work best</li>
                <li>• Keep designs under 10MB for optimal performance</li>
              </ul>
            </div>
          </div>
        )}

        {files.length > 0 && (
           <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 opacity-100 group-hover:opacity-100 transition-all duration-200 z-20 max-w-xs">
            <div className="flex items-center gap-2 text-base mb-1">
              <Image className="h-4 w-4 text-accent" />
              <span className="font-medium text-foreground">
                {files.length === 1 ? files[0].name : `${files.length} file${files.length > 1 ? 's' : ''} uploaded`}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {files.length === 1 
                ? `${(files[0].size / 1024).toFixed(1)} KB`
                : `${(files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB total`
              }
            </p>
            {isSheet && files.length < gridOption && (
              <p className="text-xs text-muted-foreground mt-1">
                {gridOption - files.length} more slots available
              </p>
            )}
          </div>
        )}
      </div>

      {filePreview}
      
      {files.length > 0 && !isSheet && (
        <div className="absolute top-0 left-0 h-full p-4 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <EditorPanel 
              scale={scale}
              setScale={setScale}
              rotation={rotation}
              setRotation={setRotation}
            />
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-accent/30 pointer-events-none" />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            hsl(var(--accent) / 0.1),
            transparent,
            hsl(var(--accent) / 0.1)
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
      </div>
    </div>
  );
}

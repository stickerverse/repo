
'use client';

import React from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { UploadCloud, X, Image, Sparkles, Zap, Copy, RotateCcw, Move, Maximize2, Trash2, Replace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EditorPanel } from './editor-panel';
import type { SizeOption as SheetSizeOption } from './size-selector';
import { cn } from '@/lib/utils';
import type { StickerShape } from './sticker-studio';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type StickerCanvasProps = {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  sizeOption: SheetSizeOption;
  gridOption: GridOption;
  product: string;
  shape: StickerShape;
};

export type GridOption = number;

export interface FileWithPreview extends FileWithPath {
  preview?: string;
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
}

export function StickerCanvas({ files, setFiles, sizeOption, gridOption, product, shape }: StickerCanvasProps) {
  const { toast } = useToast();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [selectedCellIndex, setSelectedCellIndex] = React.useState<number | null>(null);
  const [isDragMode, setIsDragMode] = React.useState(false);
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
          description: 'Only PNG, JPG, SVG, and WebP files are accepted. Please try again.',
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
    accept: { 
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
      'image/webp': ['.webp']
    },
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

  const duplicateToAllCells = React.useCallback((sourceIndex: number) => {
    const sourceFile = files[sourceIndex];
    if (!sourceFile?.preview || !isSheet) return;

    const newFiles = Array.from({ length: gridOption }, (_, index) => {
      if (index === sourceIndex) return sourceFile;
      
      if (files[index]) {
        if (files[index].preview) {
          URL.revokeObjectURL(files[index].preview);
        }
      }
      
      return Object.assign(new File([sourceFile], sourceFile.name, { type: sourceFile.type }), {
        preview: sourceFile.preview,
        position: sourceFile.position || { x: 0, y: 0 },
        scale: sourceFile.scale || 100,
        rotation: sourceFile.rotation || 0,
      });
    });

    setFiles(newFiles);
    toast({
      title: 'Design Duplicated',
      description: `Applied "${sourceFile.name}" to all ${gridOption} cells`,
    });
  }, [files, isSheet, gridOption, setFiles, toast]);

  const replaceFileInCell = React.useCallback((cellIndex: number, newFile: FileWithPath) => {
    if (files[cellIndex]?.preview) {
      URL.revokeObjectURL(files[cellIndex].preview);
    }
    
    const updatedFiles = [...files];
    updatedFiles[cellIndex] = Object.assign(newFile, {
      preview: URL.createObjectURL(newFile),
    });
    
    setFiles(updatedFiles);
  }, [files, setFiles]);

  const centerImageInCell = React.useCallback((cellIndex: number) => {
    if (!files[cellIndex]) return;
    
    const updatedFiles = [...files];
    updatedFiles[cellIndex] = Object.assign(updatedFiles[cellIndex], {
      position: { x: 0, y: 0 },
      scale: 100,
      rotation: 0,
    });
    
    setFiles(updatedFiles);
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

  const getShapeClasses = (baseShape: StickerShape) => {
    switch (baseShape) {
      case 'Circle':
        return 'rounded-full';
      case 'Square':
        return 'rounded-none';
      case 'Rounded Corners':
        return 'rounded-lg';
      case 'Contour Cut':
      default:
        return 'rounded-lg';
    }
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
      const shapeClasses = getShapeClasses(shape);
      
      return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div 
                className="w-[90%] h-[90%] grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`
                }}
            >
              {Array.from({ length: gridOption }).map((_, index) => {
                const file = files[index];
                return (
                  <TooltipProvider key={index}>
                    <div
                      className={cn('relative border-2 border-dashed border-border/30 flex items-center justify-center group aspect-square', shapeClasses, {
                        'bg-card/50': file,
                        'bg-muted/20': !file,
                        'ring-2 ring-accent ring-offset-1': selectedCellIndex === index,
                      })}
                      onClick={() => setSelectedCellIndex(selectedCellIndex === index ? null : index)}
                    >
                      {file?.preview ? (
                        <>
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain p-1 transition-transform duration-200"
                            style={{
                              transform: `scale(${(file.scale || 100) / 100}) rotate(${file.rotation || 0}deg)`,
                            }}
                          />
                          
                          {/* Hover Controls */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="flex gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-6 w-6 bg-card/90 hover:bg-card"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateToAllCells(index);
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Apply to all cells</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-6 w-6 bg-card/90 hover:bg-card"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      centerImageInCell(index);
                                    }}
                                  >
                                    <Maximize2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Center & reset</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFile(index);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove image</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          
                          {/* Cell Number Badge */}
                          <div className="absolute top-1 left-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold opacity-70">
                            {index + 1}
                          </div>
                        </>
                      ) : (
                         <div {...getRootProps({ className: 'w-full h-full' })}>
                          <div className="text-center text-muted-foreground text-xs flex flex-col items-center justify-center h-full cursor-pointer hover:bg-accent/10 rounded-lg transition-colors">
                            <div className="w-8 h-8 mx-auto mb-1 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                              <Image className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="text-[10px]">Drop or click</span>
                            
                            {/* Cell Number Badge for Empty Cells */}
                            <div className="absolute top-1 left-1 bg-muted text-muted-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold opacity-50">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TooltipProvider>
                );
              })}
            </div>
        </div>
      );
    }
    
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, isSheet, position, rotation, scale, gridOption, getGridLayout, removeFile, getRootProps, shape]);

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
                ? 'Release to upload your files' 
                : "Drag 'n' drop image files here, or click to select"
              }
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-accent" />
                <span>PNG, JPG, SVG</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                <span>Multiple formats</span>
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

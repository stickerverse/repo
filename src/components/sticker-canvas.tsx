
'use client';

import React, { useRef, useEffect } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { UploadCloud, X, Image, Sparkles, Zap, Copy, RotateCcw, Move, Maximize2, Trash2, Replace, ZoomIn, ZoomOut, Eye, Minimize, MoreHorizontal, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EditorPanel } from './editor-panel';
import type { SizeOption as SheetSizeOption } from './size-selector';
import { cn } from '@/lib/utils';
import type { StickerShape } from './sticker-studio';
import type { GridLayout } from './grid-selector';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Rnd } from 'react-rnd';
import { SafeZonesOverlay, SafeZonesToggle } from './safe-zones-overlay';

type StickerCanvasProps = {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  sizeOption: SheetSizeOption;
  gridOption: GridOption;
  gridLayout?: GridLayout;
  product: string;
  shape: StickerShape;
  mode?: 'grid' | 'freeform';
  snapToGrid?: boolean;
};

export type GridOption = number;

export interface FileWithPreview extends FileWithPath {
  preview?: string;
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
  selected?: boolean;
}

export function StickerCanvas({ files, setFiles, sizeOption, gridOption, gridLayout, product, shape, mode = 'grid', snapToGrid = false }: StickerCanvasProps) {
  const { toast } = useToast();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [selectedCellIndex, setSelectedCellIndex] = React.useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<number[]>([]);
  const [isDragMode, setIsDragMode] = React.useState(false);
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const imageRef = React.useRef<HTMLDivElement>(null);
  const [showSafeZones, setShowSafeZones] = React.useState(false);
  const [rndState, setRndState] = React.useState({ width: 400, height: 500, x: 50, y: 50 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Undo/Redo functionality
  const [history, setHistory] = React.useState<FileWithPreview[][]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const isUpdatingFromHistory = useRef(false);

  const getGridLayout = React.useCallback((count: GridOption) => {
    if (count <= 1) return { cols: 1, rows: 1 };
  
    const factors = [];
    for (let i = 1; i <= Math.sqrt(count); i++) {
        if (count % i === 0) {
            factors.push([i, count / i]);
        }
    }

    if (factors.length === 0) return { cols: count, rows: 1};

    const bestFactors = factors[factors.length -1];
    
    if (sizeOption === 'Vertical Sheet') {
      return { cols: Math.min(bestFactors[0], bestFactors[1]), rows: Math.max(bestFactors[0], bestFactors[1]) };
    } else {
      return { cols: Math.max(bestFactors[0], bestFactors[1]), rows: Math.min(bestFactors[0], bestFactors[1]) };
    }
  }, [sizeOption]);

  const isSheet = product === 'Sticker Sheet';
  const isFreeformMode = isSheet && mode === 'freeform';
  const currentGridOption = isSheet && !isFreeformMode ? gridOption : 1;
  
  // Use explicit gridLayout when provided, otherwise fall back to calculation
  const { cols, rows } = React.useMemo(() => {
    if (isFreeformMode) {
      return { cols: 1, rows: 1 }; // Freeform doesn't use grid layout
    }
    if (isSheet && gridLayout) {
      return { cols: gridLayout.cols, rows: gridLayout.rows };
    }
    return getGridLayout(currentGridOption);
  }, [isFreeformMode, isSheet, gridLayout, getGridLayout, currentGridOption]);

  // Validate and adjust grid dimensions to fit within bounds
  const getAdjustedSpacing = React.useCallback((spacing: number, margin: number, cols: number, rows: number, containerWidth: number, containerHeight: number) => {
    const minCellSize = 40; // Minimum cell size in pixels
    const totalMargins = margin * 2;
    const totalHorizontalSpacing = (cols - 1) * spacing;
    const totalVerticalSpacing = (rows - 1) * spacing;
    
    const availableWidth = containerWidth - totalMargins;
    const availableHeight = containerHeight - totalMargins;
    
    const cellWidth = (availableWidth - totalHorizontalSpacing) / cols;
    const cellHeight = (availableHeight - totalVerticalSpacing) / rows;
    
    if (cellWidth < minCellSize || cellHeight < minCellSize) {
      // Adjust spacing to ensure minimum cell size
      const maxHorizontalSpacing = Math.floor((availableWidth - (cols * minCellSize)) / (cols - 1));
      const maxVerticalSpacing = Math.floor((availableHeight - (rows * minCellSize)) / (rows - 1));
      const adjustedSpacing = Math.max(0, Math.min(spacing, maxHorizontalSpacing, maxVerticalSpacing));
      
      return { spacing: adjustedSpacing, needsAdjustment: adjustedSpacing !== spacing };
    }
    
    return { spacing, needsAdjustment: false };
  }, []);

  // Undo/Redo helper functions
  const saveToHistory = React.useCallback((newFiles: FileWithPreview[]) => {
    if (isUpdatingFromHistory.current) return;
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...newFiles]);
      
      // Keep history to a reasonable size (max 50 states)
      if (newHistory.length > 50) {
        return newHistory.slice(-50);
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = React.useCallback(() => {
    if (historyIndex > 0) {
      isUpdatingFromHistory.current = true;
      const previousState = history[historyIndex - 1];
      setFiles([...previousState]);
      setHistoryIndex(prev => prev - 1);
      setSelectedFiles([]);
      
      setTimeout(() => {
        isUpdatingFromHistory.current = false;
      }, 0);
      
      toast({
        title: 'Undo',
        description: 'Action undone',
      });
    }
  }, [history, historyIndex, setFiles, toast]);

  const redo = React.useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUpdatingFromHistory.current = true;
      const nextState = history[historyIndex + 1];
      setFiles([...nextState]);
      setHistoryIndex(prev => prev + 1);
      setSelectedFiles([]);
      
      setTimeout(() => {
        isUpdatingFromHistory.current = false;
      }, 0);
      
      toast({
        title: 'Redo',
        description: 'Action redone',
      });
    }
  }, [history, historyIndex, setFiles, toast]);

  // Helper functions for freeform mode
  const toggleFileSelection = React.useCallback((index: number, isShiftClick: boolean = false) => {
    if (!isFreeformMode) return;
    
    setSelectedFiles(prev => {
      if (isShiftClick) {
        // Multi-select with shift
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        } else {
          return [...prev, index];
        }
      } else {
        // Single select
        return prev.includes(index) ? [] : [index];
      }
    });
  }, [isFreeformMode]);

  const clearSelection = React.useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const duplicateSelectedFiles = React.useCallback(() => {
    if (!isFreeformMode || selectedFiles.length === 0) return;
    
    const newFiles = selectedFiles.map(index => {
      const originalFile = files[index];
      if (!originalFile) return null;
      
      const newFile = new File([originalFile], originalFile.name, { type: originalFile.type });
      return Object.assign(newFile, {
        preview: originalFile.preview,
        position: {
          x: (originalFile.position?.x || 50) + 20,
          y: (originalFile.position?.y || 50) + 20
        },
        scale: originalFile.scale || 100,
        rotation: originalFile.rotation || 0,
        selected: false,
      });
    }).filter(Boolean) as FileWithPreview[];
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    saveToHistory(updatedFiles);
    setSelectedFiles([]);
    
    toast({
      title: 'Files Duplicated',
      description: `Duplicated ${selectedFiles.length} file(s)`,
    });
  }, [isFreeformMode, selectedFiles, files, setFiles, saveToHistory, toast]);

  const deleteSelectedFiles = React.useCallback(() => {
    if (!isFreeformMode || selectedFiles.length === 0) return;
    
    selectedFiles.forEach(index => {
      const file = files[index];
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    const remainingFiles = files.filter((_, index) => !selectedFiles.includes(index));
    setFiles(remainingFiles);
    saveToHistory(remainingFiles);
    setSelectedFiles([]);
    
    toast({
      title: 'Files Deleted',
      description: `Deleted ${selectedFiles.length} file(s)`,
    });
  }, [isFreeformMode, selectedFiles, files, setFiles, saveToHistory, toast]);

  const snapToGridPosition = React.useCallback((x: number, y: number) => {
    if (!snapToGrid || !isFreeformMode) return { x, y };
    
    const gridSize = 20; // Grid snap size in pixels
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [snapToGrid, isFreeformMode]);

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: any[]) => {
      const rejectedFiles = fileRejections.map(rejection => rejection.file);
      if (rejectedFiles.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Only PNG, JPG, SVG, and WebP files are accepted. Please try again.',
        });
        return;
      }
      
      const maxFiles = isFreeformMode ? 50 : currentGridOption; // Allow more files in freeform mode
      const existingFilesCount = files.length;
      const filesToProcess = acceptedFiles.slice(0, maxFiles - existingFilesCount);
      
      const newFiles = filesToProcess.map((file, index) => {
        const basePosition = isFreeformMode 
          ? { x: 50 + (index * 20), y: 50 + (index * 20) } // Offset new files in freeform
          : { x: 0, y: 0 };
        
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          position: basePosition,
          scale: 100,
          rotation: 0,
          selected: false,
        });
      });

      setFiles(prevFiles => [...prevFiles, ...newFiles]);

      if (!isSheet) {
        setPosition({ x: 0, y: 0 });
        setScale(100);
        setRotation(0);
      }
    },
    [setFiles, toast, currentGridOption, files.length, isSheet, isFreeformMode]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
      'image/webp': ['.webp']
    },
    maxFiles: isFreeformMode ? 50 - files.length : isSheet ? currentGridOption - files.length : 1 - files.length,
    multiple: isSheet,
    noClick: !isFreeformMode && files.length >= currentGridOption,
    noKeyboard: !isFreeformMode && files.length >= currentGridOption,
  });

  const updateFilePosition = React.useCallback((index: number, newPosition: { x: number; y: number }) => {
    if (!isFreeformMode) return;
    
    const snappedPosition = snapToGridPosition(newPosition.x, newPosition.y);
    
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      if (updatedFiles[index]) {
        updatedFiles[index] = {
          ...updatedFiles[index],
          position: snappedPosition
        };
        
        // Save to history only when drag ends (not during drag)
        setTimeout(() => saveToHistory(updatedFiles), 100);
      }
      return updatedFiles;
    });
  }, [isFreeformMode, snapToGridPosition, setFiles, saveToHistory]);

  const removeFile = React.useCallback((indexToRemove?: number) => {
    if (indexToRemove !== undefined) {
      const fileToRemove = files[indexToRemove];
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      const updatedFiles = files.filter((_, i) => i !== indexToRemove);
      setFiles(updatedFiles);
      saveToHistory(updatedFiles);
    } else {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles([]);
      saveToHistory([]);
    }
  }, [files, setFiles, saveToHistory]);

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
        return 'rounded-full aspect-square';
      case 'Square':
        return 'rounded-none aspect-square';
      case 'Rounded Corners':
        return 'rounded-lg aspect-square';
      case 'Contour Cut':
      default:
        return 'rounded-lg';
    }
  };

  const handleFitToView = React.useCallback(() => {
    if (!canvasRef.current || !isSheet) return;
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const padding = 40; // Increased padding for better visuals
    const availableWidth = canvasBounds.width - padding * 2;
    const availableHeight = canvasBounds.height - padding * 2;
    const sheetAspectRatio = cols / rows;

    let newWidth, newHeight;
    if (availableWidth / sheetAspectRatio <= availableHeight) {
        newWidth = availableWidth;
        newHeight = availableWidth / sheetAspectRatio;
    } else {
        newHeight = availableHeight;
        newWidth = availableHeight * sheetAspectRatio;
    }

    setRndState({
      width: newWidth,
      height: newHeight,
      x: (canvasBounds.width - newWidth) / 2,
      y: (canvasBounds.height - newHeight) / 2
    });
  }, [isSheet, cols, rows]);

  useEffect(() => {
    handleFitToView();
    window.addEventListener('resize', handleFitToView);
    return () => window.removeEventListener('resize', handleFitToView);
  }, [handleFitToView, gridOption, sizeOption]);

  // Initialize history when files change externally
  useEffect(() => {
    if (!isUpdatingFromHistory.current && files.length === 0 && history.length === 0) {
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, [files.length, history.length]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFreeformMode) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFreeformMode, undo, redo]);

  const handleZoom = (factor: number) => {
    if (!canvasRef.current) return;
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const newWidth = Math.max(100, rndState.width * factor);
    const newHeight = Math.max(100, rndState.height * factor);

    setRndState(prevState => ({
      width: newWidth,
      height: newHeight,
      x: (canvasBounds.width - newWidth) / 2,
      y: (canvasBounds.height - newHeight) / 2
    }));
  }

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
    
    // Freeform mode with draggable stickers
    if (isFreeformMode) {
      return (
        <div className="w-full h-full relative">
          {files.map((file, index) => {
            if (!file.preview) return null;
            
            const isSelected = selectedFiles.includes(index);
            const position = file.position || { x: 50, y: 50 };
            
            return (
              <Rnd
                key={`freeform-${index}`}
                size={{ width: 100, height: 100 }}
                position={position}
                onDragStop={(e, d) => {
                  updateFilePosition(index, { x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateFilePosition(index, position);
                }}
                bounds="parent"
                minWidth={40}
                minHeight={40}
                className={cn(
                  "border-2 border-dashed border-transparent group cursor-move",
                  isSelected && "border-accent ring-2 ring-accent/50"
                )}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleFileSelection(index, e.shiftKey);
                }}
              >
                <div className="w-full h-full relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-contain rounded"
                    style={{
                      transform: `scale(${(file.scale || 100) / 100}) rotate(${file.rotation || 0}deg)`,
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded flex items-center justify-center">
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-6 w-6 bg-card/90 hover:bg-card"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFiles([index]);
                                duplicateSelectedFiles();
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
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
                            <p>Remove</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="absolute top-1 left-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold opacity-70">
                    {index + 1}
                  </div>
                </div>
              </Rnd>
            );
          })}
          
          {/* Multi-select context menu */}
          {selectedFiles.length > 1 && (
            <div className="absolute top-4 left-4 z-30">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-card/90 backdrop-blur-sm">
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    {selectedFiles.length} selected
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={duplicateSelectedFiles}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={deleteSelectedFiles} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearSelection}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Selection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {/* Undo/Redo buttons */}
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Undo (Ctrl+Z)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Redo (Ctrl+Y)</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Snap to grid overlay when enabled */}
          {snapToGrid && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}
        </div>
      );
    }
    
    if (isSheet) {
      const shapeClasses = getShapeClasses(shape);
      const resizeHandleClasses = 'w-3 h-3 bg-accent border-2 border-background rounded-full';
      
      const baseSpacing = gridLayout?.spacing ?? 5;
      const margin = gridLayout?.margin ?? 10;
      
      const { spacing } = getAdjustedSpacing(baseSpacing, margin, cols, rows, rndState.width, rndState.height);
      
      const stickerGrid = (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <div 
                className="grid box-border"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gap: `${spacing}px`,
                    padding: `${margin}px`,
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
            >
              {Array.from({ length: gridOption }).map((_, index) => {
                const file = files[index];
                return (
                  <TooltipProvider key={index}>
                    <div
                      className={cn('relative border-2 border-dashed border-border/30 flex items-center justify-center group min-h-0 min-w-0', shapeClasses, {
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
                            className="w-full h-full object-contain transition-transform duration-200"
                            style={{
                              transform: `scale(${(file.scale || 100) / 100}) rotate(${file.rotation || 0}deg)`,
                              padding: '2px'
                            }}
                          />
                          
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

      return (
        <Rnd
          size={{ width: rndState.width, height: rndState.height }}
          position={{ x: rndState.x, y: rndState.y }}
          onDragStop={(e, d) => { setRndState(prev => ({ ...prev, x: d.x, y: d.y })) }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setRndState({
              width: parseFloat(ref.style.width),
              height: parseFloat(ref.style.height),
              ...position,
            });
          }}
          bounds="parent"
          minWidth={200}
          minHeight={200}
          className="border-2 border-dashed border-accent flex items-center justify-center rounded-lg overflow-hidden group"
          resizeHandleComponent={{
            topLeft: <div className={cn(resizeHandleClasses, 'cursor-nwse-resize')} />,
            topRight: <div className={cn(resizeHandleClasses, 'cursor-nesw-resize')} />,
            bottomLeft: <div className={cn(resizeHandleClasses, 'cursor-nesw-resize')} />,
            bottomRight: <div className={cn(resizeHandleClasses, 'cursor-nwse-resize')} />,
            top: <div className="w-8 h-2 bg-accent/80 rounded-full cursor-ns-resize" />,
            right: <div className="w-2 h-8 bg-accent/80 rounded-full cursor-ew-resize" />,
            bottom: <div className="w-8 h-2 bg-accent/80 rounded-full cursor-ns-resize" />,
            left: <div className="w-2 h-8 bg-accent/80 rounded-full cursor-ew-resize" />,
          }}
        >
          {stickerGrid}
          <SafeZonesOverlay 
            isVisible={showSafeZones} 
            canvasWidth={rndState.width}
            canvasHeight={rndState.height}
            gridCols={cols}
            gridRows={rows}
          />
        </Rnd>
      );
    }
    
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, isSheet, isFreeformMode, position, rotation, scale, gridOption, getGridLayout, removeFile, getRootProps, shape, rndState, showSafeZones, cols, rows, selectedFiles, snapToGrid, toggleFileSelection, updateFilePosition, duplicateSelectedFiles, deleteSelectedFiles, clearSelection, undo, redo, historyIndex, history.length]);

  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 left-0 p-4 z-10">
        {files.length === 0 && isSheet && (
            <div className="text-muted-foreground bg-background/50 rounded-lg backdrop-blur-sm border border-border p-4">
              <h3 className="font-bold text-lg text-foreground mb-1">
                Sticker Sheet ({cols}x{rows})
              </h3>
              <p className="text-base">
                Drop images onto the grid cells or click to upload.
              </p>
            </div>
        )}

        {files.length === 0 && !isSheet && (
          <div className="text-muted-foreground bg-background/50 rounded-lg backdrop-blur-sm border border-border max-w-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <UploadCloud className={cn('h-8 w-8 text-accent transition-all duration-300', {
                'scale-110 animate-pulse': isDragActive
              })} />
              <h3 className="font-bold text-lg text-foreground">
                {isDragActive ? 'Drop your design here!' : 'Upload Your Design'}
              </h3>
            </div>
            <p className="text-base mb-3">
              {isDragActive 
                ? 'Release to upload your file' 
                : "Drag 'n' drop an image file here, or click to select."
              }
            </p>
            <div className="flex items-center justify-start gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-accent" />
                <span>PNG, JPG, SVG</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div 
        ref={canvasRef}
        className={cn("relative w-full h-[700px] bg-card/80 border-dashed border-2 border-border hover:border-accent transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden shadow-2xl rounded-lg")}
      >
      
      <div {...getRootProps({ 
        className: cn('w-full h-full flex items-center justify-center transition-all duration-300', {
          'bg-accent/10 scale-105': isDragActive,
          'cursor-pointer': files.length === 0 && !isSheet
        }) 
      })}
      onClick={(e) => {
        if (isFreeformMode && e.target === e.currentTarget) {
          clearSelection();
        }
      }}>
        <input {...getInputProps()} id="file-upload-input" />

        {filePreview}
      </div>
      
      
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

      {isSheet && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
           <SafeZonesToggle isVisible={showSafeZones} onToggle={setShowSafeZones} />
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleZoom(1.1)} className="h-8 w-8 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Zoom In</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleZoom(0.9)} className="h-8 w-8 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Zoom Out</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleFitToView} className="h-8 w-8 p-0">
                  <Minimize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Fit to View</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-accent/30 pointer-events-none" />
    </div>
    </div>
  );
}

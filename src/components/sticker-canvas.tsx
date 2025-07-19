'use client';

import React, { useCallback, useMemo } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

type StickerCanvasProps = {
  files: FileWithPath[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
};

export function StickerCanvas({ files, setFiles }: StickerCanvasProps) {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Only PNG files are accepted. Please try again.',
        });
        return;
      }
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    maxFiles: 1,
  });

  const removeFile = () => {
    URL.revokeObjectURL(files[0].preview);
    setFiles([]);
  };

  const filePreview = useMemo(() => {
    if (files.length > 0 && files[0].preview) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={files[0].preview}
            alt={files[0].name}
            layout="fill"
            objectFit="contain"
            onLoad={() => {
              // URL.revokeObjectURL(files[0].preview); // This causes issues with re-renders, manage cleanup elsewhere
            }}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 z-10 rounded-full"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    return null;
  }, [files]);


  return (
    <Card className="relative aspect-video w-full h-auto min-h-[300px] bg-card/30 backdrop-blur-sm border-dashed border-2 border-border hover:border-primary transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/10">
      <div {...getRootProps()} className="w-full h-full flex items-center justify-center cursor-pointer">
        <input {...getInputProps()} id="file-upload-input" />
        {files.length > 0 ? (
          filePreview
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <UploadCloud className="mx-auto h-16 w-16 mb-4 text-primary/70" />
            <p className="font-bold text-lg text-foreground">
              {isDragActive ? 'Drop the file here ...' : "Drag 'n' drop a PNG file here, or click to select"}
            </p>
            <p className="text-sm">Transparent PNGs work best</p>
          </div>
        )}
      </div>
    </Card>
  );
}

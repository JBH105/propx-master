"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import uploadMediaImage from "../../assets/images/uploadImage.png";

interface BlogCoverImageUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
}

export function BlogCoverImageUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, name }: BlogCoverImageUploadProps<TFieldValues, TName>) {
  const { getValues } = useFormContext();
  const values: any = getValues();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const value = values?.[name];
    if (value && value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(URL.createObjectURL(value));
      };
      reader.readAsDataURL(value);
    }
  }, [values?.[name]]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | undefined) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!["image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Only JPG/JPEG files are accepted");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    onChange(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (
    e: React.DragEvent,
    onChange: (value: File | undefined) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const dt = e.dataTransfer;
    const files = dt.files;

    if (files && files.length > 0) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        fileInputRef.current.files = dataTransfer.files;

        const event = new Event("change", { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base font-medium">Blog Cover Image</h2>

      <FormField
        control={control}
        name={name}
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <FormItem>
            <FormControl>
              <>
                {!preview ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
                      isDragging
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-300"
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, onChange)}
                    onClick={handleBrowseClick}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-3 rounded-full bg-purple-50">
                        <Image
                          src={uploadMediaImage}
                          alt="upload document"
                          className="bg-white"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">
                          Drag and drop image
                        </p>
                        <p className="text-sm text-gray-500">
                          or{" "}
                          <span className="text-[#812AD8] hover:underline focus:outline-none">
                            browse
                          </span>{" "}
                          to choose a image
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Accepted file formats : JPG, JPEG</p>
                        <p className="mt-1">
                          (1600x1200 or larger recommended, up to 10MB each)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-fit w-fit">
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt="Blog cover preview"
                      height={300}
                      width={650}
                      className="rounded-2xl"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-4xl text-[#812AD8]"
                      onClick={handleBrowseClick}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Replace
                    </Button>
                  </div>
                )}

                <Input
                  {...fieldProps}
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    handleFileChange(e, onChange);
                  }}
                />
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Camera, CircleUserRound, Delete, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface ProfileImageUploadProps {
  name: string;
}

export function ProfileImageUpload({ name }: ProfileImageUploadProps) {
  const {
    setValue,
    formState: { errors },
    getValues,
    trigger
  } = useFormContext();
  const values: any = getValues();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const value = values?.[name]
    if(value && value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(URL.createObjectURL(value));
      };
      reader.readAsDataURL(value);
    }
  },[values?.[name]]);

  const errorMessage = errors[name]?.message as string | undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue(name, file, { shouldValidate: true });
    trigger(name);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteClick = () => {
    setValue(name, null, { shouldValidate: true });
    trigger(name);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-base font-medium mb-5">
        Author&apos;s Profile Image
      </h2>

      <div className="flex flex-col items-center">
        <div className="rounded-full overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
          {previewUrl ? (
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Profile preview"
              width={122}
              height={122}
              className="object-cover"
            />
          ) : (
            <div className="h-[112px] w-[112px] bg-[#EAEAEA] rounded-full flex items-center justify-center">
              <CircleUserRound size={40} color="#9A9A9A" />
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="flex items-center space-x-1 mb-6">
            <Button
              variant="purple"
              type={"button"}
              className="flex items-center text-[#812AD8] mb-6 bg-white gap-1 border-none"
              onClick={handleUploadClick}
            >
              <Camera size={24} />
              Edit Photo
            </Button>
            <Button
              variant="purple"
              type={"button"}
              className="flex items-center text-[#595959] mb-6 bg-white gap-1 border-none"
              onClick={handleDeleteClick}
            >
              <Trash2 />
              Delete Photo
            </Button>
          </div>
        ) : (
          <Button
            variant="purple"
            type={"button"}
            className="flex items-center text-[#812AD8] mb-6 bg-white gap-1 border-none"
            onClick={handleUploadClick}
          >
            <Camera size={24} />
            Upload Photo
          </Button>
        )}
      </div>

      <div className="border-t border-gray-200 w-full"></div>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}
    </div>
  );
}

"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Upload, ImageIcon, GripVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatBytes } from "@/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import uploadMediaImage from "../../assets/images/uploadImage.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from "axios";
import { Loader } from "../ui/loader";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface MediaUploadProps {
  name: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  accept?: string;
}

export default function MediaUpload({
  name = "mediaFiles",
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  accept = ".jpg,.jpeg,.png",
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Set up global drag and drop event listeners
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDocumentDragOver = (e: DragEvent) => {
      preventDefaults(e);
      setIsDragging(true);
    };

    const handleDocumentDragLeave = (e: DragEvent) => {
      preventDefaults(e);

      // Only set isDragging to false if we're leaving the document
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };

    // We don't want to handle drop at the document level
    // as it would interfere with our component's drop handler
    const handleDocumentDrop = (e: DragEvent) => {
      preventDefaults(e);
      setIsDragging(false);
      // Don't process files here, let the component's drop handler do it
    };

    // Add global event listeners
    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("dragleave", handleDocumentDragLeave);
    document.addEventListener("drop", handleDocumentDrop);

    return () => {
      // Clean up event listeners
      document.removeEventListener("dragover", handleDocumentDragOver);
      document.removeEventListener("dragleave", handleDocumentDragLeave);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, []);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File[]) => void,
    currentFiles: Array<any>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setLoading(true);
    try {
      const validFiles = newFiles.filter((file) => file.size <= maxSize);

      const response = await Promise.all(
        validFiles?.map((file) => {
          const form = new FormData();
          form.append("file", file);
          form.append("fileName", file.name);
          return axios.post("/api/upload-file", form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        })
      );
      const updatedFiles = [
        ...currentFiles,
        ...response?.map((response, index) => {
          return {
            file: validFiles?.[index],
            previewUrl: response?.data?.publicUrl,
          };
        }),
      ];
      onChange(updatedFiles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    onChange: (value: File[]) => void,
    currentFiles: File[]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    console.log("Drop event triggered");
    console.log("Files in drop event:", e.dataTransfer.files.length);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      console.log(
        "Files being processed:",
        newFiles.map((f) => f.name).join(", ")
      );

      // Accept all files initially, then filter by type if needed
      let validFiles = newFiles;

      if (accept) {
        const acceptedTypes = accept
          .split(",")
          .map((type) => type.trim().toLowerCase().replace(".", ""));
        validFiles = newFiles.filter((file) => {
          const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
          const isValidType = acceptedTypes.includes(fileExtension);
          const isValidSize = file.size <= maxSize;

          console.log(
            `File: ${file.name}, Valid type: ${isValidType}, Valid size: ${isValidSize}`
          );

          return isValidType && isValidSize;
        });
      }

      console.log("Valid files count:", validFiles.length);

      // Combine with existing files, respecting maxFiles limit
      const updatedFiles = [...currentFiles, ...validFiles].slice(0, maxFiles);
      console.log("Updated files count:", updatedFiles.length);

      // Update the form state
      onChange(updatedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if we're leaving the drop area (not just moving between child elements)
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const removeImage = async (
    index: number,
    onChange: (value: File[]) => void,
    files: File[],
    previewUrl: string
  ) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
    try {
      await axios.delete("/api/delete-file", {
        data: {
          fileName:
            previewUrl?.split("/")?.[previewUrl?.split("/")?.length - 1],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onDragEnd = (
    result: any,
    onChange: (value: File[]) => void,
    files: File[]
  ) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (files: File[]) =>
            files.length > 0 || "At least one image is required.",
        }}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => {
          const files = value as any;
          const fileObjects = files.map((item: any, index: number) => {
            const file: any = item?.file;
            return {
              id: `file-${index}`,
              file,
              preview: item?.previewUrl,
              name: file.name,
              size: file.size,
            };
          });

          return (
            <div className="w-full">
              {files.length === 0 ? (
                <div
                  ref={dropAreaRef}
                  className={`border-2 border-dashed ${
                    isDragging
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300"
                  } rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDrop(e, onChange, files);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.currentTarget === e.target) {
                      setIsDragging(false);
                    }
                  }}
                  onClick={triggerFileInput}
                >
                  {loading ? (
                    <Loader label="Uploading Image..." size="lg" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                        <Image
                          src={uploadMediaImage || "/placeholder.svg"}
                          alt="upload document"
                          className="bg-white"
                        />
                      </div>
                      <p className="text-sm font-medium">Drag and drop image</p>
                      <p className="text-xs text-gray-500">
                        or <span className="text-purple-500">browse</span> to
                        choose a image
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Accepted file formats: JPG, JPEG, PNG
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        (1600x1200 or larger recommended, up to 10MB each)
                      </p>
                    </>
                  )}
                  {!loading && (
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, onChange, files)}
                      accept={accept}
                      multiple
                      className="hidden"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <DragDropContext
                    onDragEnd={(result) => onDragEnd(result, onChange, files)}
                  >
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {fileObjects.map((image: any, index: number) => (
                            <Draggable
                              key={image.id}
                              draggableId={image.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card className="overflow-hidden rounded-xl">
                                    <div className="relative h-48">
                                      <img
                                        src={
                                          image.preview || "/placeholder.svg"
                                        }
                                        alt={image.name}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openImagePreview(image.preview);
                                        }}
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeImage(
                                            index,
                                            onChange,
                                            files,
                                            image.preview
                                          );
                                        }}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 cursor-pointer"
                                        type="button"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className="p-3 flex items-center justify-between bg-white">
                                      <div className="flex items-center space-x-2">
                                        <ImageIcon className="h-5 w-5 text-purple-500" />
                                        <div>
                                          <p className="text-sm truncate max-w-[120px]">
                                            {image.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {formatBytes(image.size)}
                                          </p>
                                        </div>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          {/* <Button variant="ghost" size="icon"> */}
                                          <GripVerticalIcon size={21} />
                                          {/* </Button> */}
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              removeImage(
                                                index,
                                                onChange,
                                                files,
                                                image?.previewUrl
                                              )
                                            }
                                          >
                                            Remove
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <div
                    className={`flex justify-center border-2 border-dashed ${
                      isDragging
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    } rounded-lg p-4`}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDrop(e, onChange, files);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.currentTarget === e.target) {
                        setIsDragging(false);
                      }
                    }}
                  >
                    <Button
                      variant="purple"
                      onClick={triggerFileInput}
                      className="flex items-center space-x-2 text-purple-500"
                      type="button"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload More</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, onChange, files)}
                      accept={accept}
                      multiple
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />
      {errors[name]?.message && (
        <p className="text-red-500 text-sm mt-2">
          {errors[name]?.message as string}
        </p>
      )}
      {previewOpen && previewImage && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-[1100px] max-w-[90%] w-full p-0 overflow-hidden max-h-[90vh] overflow-y-auto bg-white">
            <div className="relative flex items-center justify-center">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="w-full max-h-[85vh] object-contain"
              />
              <button
                onClick={() => setPreviewOpen(false)}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 cursor-pointer"
                type="button"
              >
                <X className="h-5 w-5 cursor-pointer" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

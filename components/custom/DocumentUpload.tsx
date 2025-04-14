"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  MoreVertical,
  FileIcon,
  GripVerticalIcon,
} from "lucide-react";
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
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import uploadDocumentImage from "../../assets/images/documentUpload.png";
import axios from "axios";
import { Loader } from "../ui/loader";

interface UploadedDocument {
  id: string;
  file: File;
  preview?: string;
  name: string;
  size: number;
  previewUrl?: string;
}

interface DocumentUploadProps {
  name: string;
  label: string;
  description?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  accept?: string;
}

export default function DocumentUpload({
  name,
  label,
  description,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  accept = ".pdf",
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { control } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const [documentPreviews, setDocumentPreviews] = useState<UploadedDocument[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all object URLs to avoid memory leaks
      documentPreviews.forEach((doc) => {
        if (doc.preview && doc.preview.startsWith("blob:")) {
          URL.revokeObjectURL(doc.preview);
        }
      });
    };
  }, [documentPreviews]);

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

  // Generate PDF previews
  const generatePdfPreview = async (file: File): Promise<string> => {
    try {
      // Create a blob URL for the file
      const url = URL.createObjectURL(file);
      return url;
    } catch (error) {
      console.error("Error generating preview:", error);
      return "";
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File[]) => void,
    currentFiles: Array<any>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => file.size <= maxSize);

    // Combine with existing files, respecting maxFiles limit
    const updatedFiles = [...(currentFiles || [])];

    // Generate previews for new files
    for (const file of validFiles) {
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("fileName", file.name);
        const response = await axios.post("/api/upload-file", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const preview = await generatePdfPreview(file);
        const newDoc: UploadedDocument = {
          id: `file-${Date.now()}-${file.name}`,
          file,
          preview,
          name: file.name,
          size: file.size,
        };
        updatedFiles?.push({
          file: file,
          previewUrl: response?.data?.publicUrl,
        });

        setDocumentPreviews((prev) => [...prev, newDoc]);
      } catch (error) {
        console.error("Error generating preview for", file.name, error);
      }
      onChange(updatedFiles);
      setLoading(false);
    }

    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    onChange: (value: File[]) => void,
    currentFiles: File[]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);

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

          return isValidType && isValidSize;
        });
      }

      // Combine with existing files, respecting maxFiles limit
      const updatedFiles = [...currentFiles, ...validFiles].slice(0, maxFiles);

      // Generate previews for new files
      for (const file of validFiles) {
        try {
          const preview = await generatePdfPreview(file);
          const newDoc: UploadedDocument = {
            id: `file-${Date.now()}-${file.name}`,
            file,
            preview,
            name: file.name,
            size: file.size,
          };

          setDocumentPreviews((prev) => [...prev, newDoc]);
        } catch (error) {
          console.error("Error generating preview for", file.name, error);
        }
      }

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

  const removeDocument = async (
    index: number,
    onChange: (value: File[]) => void,
    files: File[],
    previewUrl: string
  ) => {
    const newFiles = [...files];
    const removedFile = newFiles[index];

    // Find and remove the preview
    setDocumentPreviews((prev) => {
      const updatedPreviews = prev.filter(
        (doc) =>
          !(doc.name === removedFile.name && doc.size === removedFile.size)
      );

      // Clean up the removed preview URL
      const removedDoc = prev.find(
        (doc) => doc.name === removedFile.name && doc.size === removedFile.size
      );

      if (removedDoc?.preview && removedDoc.preview.startsWith("blob:")) {
        URL.revokeObjectURL(removedDoc.preview);
      }

      return updatedPreviews;
    });

    // Remove the file from the list
    newFiles.splice(index, 1);
    onChange(newFiles);
    // try {
    //   await axios.delete("/api/delete-file", {
    //     data: {
    //       fileName:
    //         previewUrl?.split("/")?.[previewUrl?.split("/")?.length - 1],
    //     },
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
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

  // Find preview for a file
  const getPreviewForFile = (file: File) => {
    const doc = documentPreviews.find(
      (doc) => doc.name === file.name && doc.size === file.size
    );
    return doc?.preview || "";
  };

  // Sync document previews with current files
  useEffect(() => {
    const syncPreviews = async (files: File[]) => {
      // Generate any missing previews
      for (const file of files) {
        const existingPreview = documentPreviews.find(
          (doc) => doc.name === file.name && doc.size === file.size
        );

        if (!existingPreview) {
          try {
            const preview = await generatePdfPreview(file);
            const newDoc: UploadedDocument = {
              id: `file-${Date.now()}-${file.name}`,
              file,
              preview,
              name: file.name,
              size: file.size,
            };

            setDocumentPreviews((prev) => [...prev, newDoc]);
          } catch (error) {
            console.error("Error generating preview for", file.name, error);
          }
        }
      }

      // Remove previews for files that no longer exist
      setDocumentPreviews((prev) => {
        const currentFileNames = new Set(
          files.map((f) => `${f.name}-${f.size}`)
        );
        return prev.filter((doc) =>
          currentFileNames.has(`${doc.name}-${doc.size}`)
        );
      });
    };

    // Get files from the form
    const formFiles = (control._formValues?.[name] as Array<any>) || [];
    if (formFiles.length > 0) {
      syncPreviews(formFiles);
    }
  }, [control._formValues, name]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field: { onChange, value } }) => {
        const files = (value as Array<any>) || [];
        const fileObjects =
          files?.map?.((item, index) => {
            const file = item?.file;
            return {
              id: `file-${index}`,
              file,
              name: file.name,
              size: file.size,
              previewUrl: item?.previewUrl,
            };
          }) || [];

        return (
          <AccordionItem
            value={name}
            className="border-none border-gray-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-base font-medium">{label}</h3>
                  {description && (
                    <p className="text-xs text-gray-500">{description}</p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {files.length === 0 ? (
                <div
                  ref={dropAreaRef}
                  className={`border-2 border-dashed ${
                    isDragging
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300"
                  } rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
                  onDrop={(e) => handleDrop(e, onChange, files)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={triggerFileInput}
                >
                  {loading ? (
                    <Loader label="Uploading Document..." size="lg" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                        <Image
                          src={uploadDocumentImage}
                          alt="upload document"
                          className="bg-white"
                        />
                      </div>
                      <p className="text-sm font-medium">Drag and drop file</p>
                      <p className="text-xs text-gray-500">
                        or{" "}
                        <span className="text-purple-500 cursor-pointer">
                          browse
                        </span>{" "}
                        to choose a file
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Accepted file formats: PDF
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        (1600x1200 or larger recommended, up to 10MB each)
                      </p>
                    </>
                  )}
                 {!loading && <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, onChange, files)}
                    accept={accept}
                    multiple
                    className="hidden"
                  />}
                </div>
              ) : (
                <div className="space-y-4">
                  <DragDropContext
                    onDragEnd={(result) => onDragEnd(result, onChange, files)}
                  >
                    <Droppable
                      droppableId={`documents-${name}`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {fileObjects.map((doc, index) => {
                            const previewUrl = getPreviewForFile(doc.file);

                            return (
                              <Draggable
                                key={doc.id}
                                draggableId={doc.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${
                                      snapshot.isDragging ? "z-50" : ""
                                    }`}
                                  >
                                    <Card
                                      className={`overflow-hidden rounded-xl ${
                                        snapshot.isDragging
                                          ? "shadow-lg ring-2 ring-blue-400"
                                          : "border border-gray-200"
                                      } cursor-grab`}
                                    >
                                      <div className="relative h-48 bg-blue-50 px-2 pt-2">
                                        <div className="absolute top-2 right-2 z-10">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeDocument(
                                                index,
                                                onChange,
                                                files,
                                                doc?.previewUrl
                                              );
                                            }}
                                            className="bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 cursor-pointer"
                                            type="button"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>

                                        {/* PDF Preview using iframe */}
                                        <div className="w-full h-full overflow-hidden">
                                          {doc?.previewUrl ? (
                                            <iframe
                                              src={doc?.previewUrl}
                                              className="w-full h-full"
                                              title={doc.name}
                                            />
                                          ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                              <FileIcon className="h-12 w-12 text-gray-400 mb-2" />
                                              <p className="text-sm text-gray-500">
                                                PDF Preview
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="p-3 flex items-center justify-between bg-white">
                                        <div className="flex items-center space-x-2">
                                          <FileIcon className="h-5 w-5 text-purple-500" />
                                          <div>
                                            <p className="text-sm truncate max-w-[120px]">
                                              {doc.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {formatBytes(doc.size)}
                                            </p>
                                          </div>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <div className="cursor-pointer">
                                              <GripVerticalIcon size={21} />
                                            </div>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                              onClick={() =>
                                                removeDocument(
                                                  index,
                                                  onChange,
                                                  files,
                                                  doc?.previewUrl
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
                            );
                          })}
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
                    onDrop={(e) => handleDrop(e, onChange, files)}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Button
                      variant="purple"
                      onClick={triggerFileInput}
                      className="flex items-center space-x-2 text-purple-500 border-purple-500 border-0"
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
            </AccordionContent>
          </AccordionItem>
        );
      }}
    />
  );
}

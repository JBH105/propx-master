import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
}

export async function fileFromUrl(fileUrl: string) {
  const fileName = fileUrl?.split("/")?.[fileUrl?.split("/")?.length - 1];
  const response = await axios.post(
    "/api/convert-url-to-file",
    { fileUrl },
    {
      responseType: "blob",
    }
  );
  const blob = response.data;

  const contentType = blob.type;
  const extension = contentType.split("/")[1];

  return new File([blob], `${fileName}`, { type: contentType });
}

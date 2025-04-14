"use client";

import dynamic from "next/dynamic";
import { useController, useFormContext } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { FormLabel } from "../ui/form";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    [
      {
        color: [
          "#000000",
          "#e60000",
          "#ff9900",
          "#ffff00",
          "#008a00",
          "#0066cc",
          "#9933ff",
          "#ffffff",
          "#facccc",
          "#ffebcc",
          "#ffffcc",
          "#cce8cc",
          "#cce0f5",
          "#ebd6ff",
          "#bbbbbb",
          "#f06666",
          "#ffc266",
          "#ffff66",
          "#66b966",
          "#66a3e0",
          "#c285ff",
          "#888888",
          "#a10000",
          "#b26b00",
          "#b2b200",
          "#006100",
          "#0047b2",
          "#6b24b2",
          "#444444",
          "#5c0000",
          "#663d00",
          "#666600",
          "#003700",
          "#002966",
          "#3d1466",
          "custom-color",
        ],
      },
    ],
  ],
};

const formats = [
  "header",
  "height",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "color",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
  "size",
];

type Props = {
  name: string;
  label: string;
  placeholder: string;
};

const TextEditor: React.FC<Props> = ({ name, label, placeholder }) => {
  const {
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext();

  const {
    field: { value, onChange },
  } = useController({ name, control });

  const showError = errors[name] && (touchedFields[name] || isSubmitted);

  return (
    <div className="space-y-1">
      <FormLabel className="text-xs text-gray-500">{label}</FormLabel>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={(val: any) => onChange(val)}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      {showError && (
        <p className="text-sm text-red-500">{String(errors[name]?.message)}</p>
      )}
    </div>
  );
};

export default TextEditor;

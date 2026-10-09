import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Info } from "lucide-react";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  file?: File | null;
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect?.(acceptedFiles[0] ?? null);
    },
    [onFileSelect],
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  return (
    <div className="gradient-border w-full">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" className="size-10" alt="pdf" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-xm text-gray-700 font-medium truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  onFileSelect?.(null);
                }}
              >
                <img src="/icons/cross.svg" className="w-4 h-4" alt="remove" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-10 h-10 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                <Info size={20} />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-bold">Click to upload </span> or Drag and
                drop
              </p>
              <p className="text-lg text-gray-500">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { FileUploader };

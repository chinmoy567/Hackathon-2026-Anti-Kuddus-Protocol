import { useRef } from "react";
import { ALLOWED_EVIDENCE_MIME_TYPES, MAX_EVIDENCE_SIZE_MB } from "../../utils/constants.js";

// Client-side type/size pre-check is cosmetic only — fast feedback for the
// user. The server always re-validates and fully re-encodes regardless
// (Frontend.md FE-4, System Architecture.md D6).
export const EvidenceDropzone = ({ files, onChange, disabled }) => {
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    const accepted = fileList.filter(
      (file) => ALLOWED_EVIDENCE_MIME_TYPES.includes(file.type) && file.size <= MAX_EVIDENCE_SIZE_MB * 1024 * 1024
    );
    onChange([...files, ...accepted]);
  };

  const removeFile = (index) => onChange(files.filter((_, i) => i !== index));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Photo evidence (optional)</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!disabled) addFiles(Array.from(e.dataTransfer.files));
        }}
        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center
          transition-colors duration-150 hover:border-slate-400 hover:bg-slate-100"
      >
        <p className="text-sm text-slate-500">Drag & drop photos here, or click to browse</p>
        <p className="mt-1 text-xs text-slate-400">
          JPEG, PNG or WEBP — up to {MAX_EVIDENCE_SIZE_MB}MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EVIDENCE_MIME_TYPES.join(",")}
          multiple
          hidden
          disabled={disabled}
          onChange={(e) => addFiles(Array.from(e.target.files))}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white opacity-0
                  transition-opacity duration-150 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

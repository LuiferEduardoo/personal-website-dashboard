import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';

type Props = {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
};

function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

export default function ImageDropzone({ onFiles, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files).filter(isImage);
    if (files.length > 0) onFiles(files);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter(isImage);
    event.target.value = '';
    if (files.length > 0) onFiles(files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!disabled) inputRef.current?.click();
        }
      }}
      className={
        'flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition focus:outline-none focus:ring-2 focus:ring-primary/30 ' +
        (disabled
          ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
          : isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 bg-white hover:border-primary/60 hover:bg-gray-50')
      }
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={isDragging ? 'text-primary' : 'text-gray-400'}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p className="text-sm font-medium text-gray-900">
        {isDragging
          ? 'Suelta las imágenes aquí'
          : 'Arrastra imágenes aquí o haz clic para seleccionarlas'}
      </p>
      <p className="text-xs text-gray-500">PNG, JPG, WebP — se convertirán a WebP</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}

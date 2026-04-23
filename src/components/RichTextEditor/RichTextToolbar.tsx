import type { Editor } from '@tiptap/react';
import type { ChangeEvent, ReactNode } from 'react';
import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../features/images/api';

type Props = {
  editor: Editor | null;
  uploadFolder?: string;
};

type ToolButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
};

function ToolButton({ onClick, active, disabled, title, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={
        'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition ' +
        (active
          ? 'bg-primary/10 text-primary'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40')
      }
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden />;
}

export default function RichTextToolbar({ editor, uploadFolder }: Props) {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const setHeading = (level: 1 | 2 | 3 | 0) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
      return;
    }
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const currentHeadingLevel = () => {
    if (editor.isActive('heading', { level: 1 })) return '1';
    if (editor.isActive('heading', { level: 2 })) return '2';
    if (editor.isActive('heading', { level: 3 })) return '3';
    return '0';
  };

  const handleImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !token) return;
    try {
      const image = await uploadImage(file, token, uploadFolder);
      editor.chain().focus().setImage({ src: image.url, alt: image.name }).run();
    } catch (err) {
      console.error('Error uploading image', err);
    }
  };

  const handleInsertLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL del enlace', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
      <select
        value={currentHeadingLevel()}
        onChange={(e) => setHeading(Number(e.target.value) as 0 | 1 | 2 | 3)}
        aria-label="Tamaño de texto"
        className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        <option value="0">Párrafo</option>
        <option value="1">Título 1</option>
        <option value="2">Título 2</option>
        <option value="3">Título 3</option>
      </select>

      <Divider />

      <ToolButton
        title="Negrita"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <span className="font-bold">B</span>
      </ToolButton>
      <ToolButton
        title="Cursiva"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <span className="italic">I</span>
      </ToolButton>
      <ToolButton
        title="Tachado"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
      >
        <span className="line-through">S</span>
      </ToolButton>
      <ToolButton
        title="Código en línea"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
      >
        <span className="font-mono text-xs">&lt;/&gt;</span>
      </ToolButton>

      <Divider />

      <ToolButton
        title="Lista con viñetas"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        •
      </ToolButton>
      <ToolButton
        title="Lista numerada"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        1.
      </ToolButton>
      <ToolButton
        title="Cita"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
      >
        ❝
      </ToolButton>
      <ToolButton
        title="Bloque de código"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
      >
        {'{ }'}
      </ToolButton>

      <Divider />

      <ToolButton title="Insertar enlace" onClick={handleInsertLink} active={editor.isActive('link')}>
        🔗
      </ToolButton>
      <ToolButton
        title="Insertar imagen"
        onClick={() => fileInputRef.current?.click()}
      >
        🖼
      </ToolButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFile}
        className="hidden"
      />

      <Divider />

      <ToolButton
        title="Deshacer"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        ↶
      </ToolButton>
      <ToolButton
        title="Rehacer"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        ↷
      </ToolButton>
    </div>
  );
}

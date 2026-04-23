import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import RichTextToolbar from './RichTextToolbar';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  uploadFolder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  uploadFolder,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({ inline: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'rich-editor px-4 py-3',
        'data-placeholder': placeholder ?? '',
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <RichTextToolbar editor={editor} uploadFolder={uploadFolder} />
      <EditorContent editor={editor} />
    </div>
  );
}

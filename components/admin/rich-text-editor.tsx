"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Link2, Minus, Undo, Redo } from "lucide-react";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const btnBase: React.CSSProperties = {
  padding: "5px 8px",
  borderRadius: 6,
  border: "1px solid var(--islametra-line)",
  background: "transparent",
  color: "var(--islametra-fg-mute)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontFamily: "'Geist', sans-serif",
  transition: "background 0.1s, color 0.1s",
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: "oklch(0.62 0.13 155 / 0.15)",
  color: "oklch(0.82 0.12 155)",
  borderColor: "oklch(0.62 0.13 155 / 0.3)",
};

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Tulis konten artikel di sini..." }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: [
          "min-height:320px",
          "padding:16px",
          "outline:none",
          "font-family:'Geist',sans-serif",
          "font-size:14px",
          "line-height:1.75",
          "color:var(--islametra-fg-soft)",
        ].join(";"),
      },
    },
  });

  useEffect(() => {
    if (editor && value === "" && editor.getHTML() !== "<p></p>") {
      editor.commands.clearContent();
    }
  }, [editor, value]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const toolbarItems = [
    { icon: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
    { icon: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
    null,
    { icon: <Heading2 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), title: "H2" },
    { icon: <Heading3 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), title: "H3" },
    null,
    { icon: <List size={14} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), title: "Bullet List" },
    { icon: <ListOrdered size={14} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), title: "Ordered List" },
    null,
    { icon: <Link2 size={14} />, action: addLink, active: editor.isActive("link"), title: "Link" },
    { icon: <Minus size={14} />, action: () => editor.chain().focus().setHorizontalRule().run(), active: false, title: "Divider" },
    null,
    { icon: <Undo size={14} />, action: () => editor.chain().focus().undo().run(), active: false, title: "Undo" },
    { icon: <Redo size={14} />, action: () => editor.chain().focus().redo().run(), active: false, title: "Redo" },
  ];

  return (
    <div style={{ borderRadius: 10, border: "1px solid var(--islametra-line)", overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", borderBottom: "1px solid var(--islametra-line)", flexWrap: "wrap", background: "rgba(255,255,255,0.02)" }}>
        {toolbarItems.map((item, i) =>
          item === null ? (
            <div key={i} style={{ width: 1, height: 18, background: "var(--islametra-line)", margin: "0 2px" }} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={item.action}
              title={item.title}
              style={item.active ? btnActive : btnBase}
              onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--islametra-fg-soft)"; } }}
              onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--islametra-fg-mute)"; } }}
            >
              {item.icon}
            </button>
          )
        )}
      </div>

      {/* Editor area */}
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: var(--islametra-fg-dim);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap h2 { font-size: 18px; font-weight: 700; margin: 16px 0 8px; letter-spacing: -0.02em; }
        .tiptap h3 { font-size: 15px; font-weight: 600; margin: 14px 0 6px; }
        .tiptap ul { padding-left: 20px; list-style: disc; }
        .tiptap ol { padding-left: 20px; list-style: decimal; }
        .tiptap li { margin: 4px 0; }
        .tiptap hr { border: none; border-top: 1px solid var(--islametra-line); margin: 16px 0; }
        .tiptap a { color: oklch(0.78 0.13 155); text-decoration: underline; }
        .tiptap strong { font-weight: 700; }
        .tiptap em { font-style: italic; }
        .tiptap p { margin: 0 0 8px; }
        .tiptap p:last-child { margin-bottom: 0; }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill CSS

interface QuillEditorProps {
  onChange: (content: string) => void;
  value: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ onChange, value }) => {
  const quillRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current === null && quillRef.current) {
      // Initialize Quill editor
      editorRef.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
            ["clean"],
          ],
        },
      });

      // Handle text change
      editorRef.current.on("text-change", () => {
        const content = editorRef.current?.root.innerHTML || "";
        onChange(content);
      });
    }
  }, [onChange]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.root.innerHTML) {
      editorRef.current.root.innerHTML = value;
    }
  }, [value]);

  return <div ref={quillRef} style={{ height: "200px" }} />;
};

export default QuillEditor;
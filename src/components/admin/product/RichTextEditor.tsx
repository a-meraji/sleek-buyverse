import { useCallback } from "react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { createEditor, Descendant, Editor, Element as SlateElement } from "slate";
import { withHistory } from "slate-history";

const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'block-quote':
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
      case 'bulleted-list':
        return <ul {...props.attributes}>{props.children}</ul>;
      case 'heading-one':
        return <h1 {...props.attributes}>{props.children}</h1>;
      case 'heading-two':
        return <h2 {...props.attributes}>{props.children}</h2>;
      case 'list-item':
        return <li {...props.attributes}>{props.children}</li>;
      case 'numbered-list':
        return <ol {...props.attributes}>{props.children}</ol>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return (
      <span
        {...props.attributes}
        style={{
          fontWeight: props.leaf.bold ? 'bold' : 'normal',
          fontStyle: props.leaf.italic ? 'italic' : 'normal',
          textDecoration: props.leaf.underline ? 'underline' : 'none',
        }}
      >
        {props.children}
      </span>
    );
  }, []);

  const editor = withHistory(withReact(createEditor()));

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div className="border rounded-md p-4">
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter product description..."
          spellCheck
          className="min-h-[200px] focus:outline-none"
        />
      </div>
    </Slate>
  );
}
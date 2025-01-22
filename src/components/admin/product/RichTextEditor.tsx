import { useCallback } from "react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from "slate";
import { withHistory } from "slate-history";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(!Editor.isEditor(n) && SlateElement.isElement(n) ? n.type : ''),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const FormatButton = ({ format, icon: Icon, isBlock = false }: { format: string; icon: any; isBlock?: boolean }) => {
  const editor = ReactEditor.useSlate();
  const isActive = isBlock ? isBlockActive(editor, format) : isMarkActive(editor, format);

  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        if (isBlock) {
          toggleBlock(editor, format);
        } else {
          toggleMark(editor, format);
        }
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

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
    <Slate editor={editor} initialValue={value} onChange={onChange}>
      <div className="border rounded-md p-4">
        <div className="flex gap-1 mb-2 border-b pb-2">
          <FormatButton format="bold" icon={Bold} />
          <FormatButton format="italic" icon={Italic} />
          <FormatButton format="underline" icon={Underline} />
          <FormatButton format="bulleted-list" icon={List} isBlock />
          <FormatButton format="numbered-list" icon={ListOrdered} isBlock />
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter product description..."
          spellCheck
          className="min-h-[200px] focus:outline-none"
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (event.ctrlKey || event.metaKey) {
                const key = hotkey.replace('mod+', '');
                if (key === event.key.toLowerCase()) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
                  toggleMark(editor, mark);
                }
              }
            }
          }}
        />
      </div>
    </Slate>
  );
}
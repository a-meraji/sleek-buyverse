import { Editor, Element as SlateElement } from 'slate';
import { useSlate } from 'slate-react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { CustomEditor } from './types';

const isBlockActive = (editor: CustomEditor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'bulleted-list' || format === 'numbered-list';

  Editor.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['bulleted-list', 'numbered-list'].includes(n.type),
    split: true,
  });

  Editor.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Editor.wrapNodes(editor, block);
  }
};

const isMarkActive = (editor: CustomEditor, format: keyof Omit<CustomEditor, 'text'>) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format as any);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

interface ToolbarButtonProps {
  format: string;
  icon: React.ElementType;
  isBlock?: boolean;
}

const ToolbarButton = ({ format, icon: Icon, isBlock = false }: ToolbarButtonProps) => {
  const editor = useSlate();
  const isActive = isBlock
    ? isBlockActive(editor, format)
    : isMarkActive(editor, format as any);

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

export const Toolbar = () => {
  return (
    <div className="flex gap-1 p-1 border-b">
      <ToolbarButton format="bold" icon={Bold} />
      <ToolbarButton format="italic" icon={Italic} />
      <ToolbarButton format="underline" icon={Underline} />
      <ToolbarButton format="bulleted-list" icon={List} isBlock />
      <ToolbarButton format="numbered-list" icon={ListOrdered} isBlock />
    </div>
  );
};
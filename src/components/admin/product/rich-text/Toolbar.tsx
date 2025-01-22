import { Editor, Element as SlateElement, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { CustomElement, CustomEditor, CustomText } from './types';

const isBlockActive = (editor: CustomEditor, format: CustomElement['type']) => {
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

const toggleBlock = (editor: CustomEditor, format: CustomElement['type']) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'bulleted-list' || format === 'numbered-list';

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['bulleted-list', 'numbered-list'].includes(n.type),
    split: true,
  });

  const newProperties: Partial<CustomElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };

  Transforms.setNodes<CustomElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: CustomElement = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isMarkActive = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const isActive = isMarkActive(editor, format);

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
    ? isBlockActive(editor, format as CustomElement['type'])
    : isMarkActive(editor, format as keyof Omit<CustomText, 'text'>);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent focus loss
    if (isBlock) {
      toggleBlock(editor, format as CustomElement['type']);
    } else {
      toggleMark(editor, format as keyof Omit<CustomText, 'text'>);
    }
  };

  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      className={`${isActive ? 'bg-secondary' : ''}`}
      onMouseDown={handleMouseDown}
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
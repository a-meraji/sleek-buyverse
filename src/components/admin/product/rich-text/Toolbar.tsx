import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { Editor } from "slate";
import { useSlate } from "slate-react";

interface ToolbarButtonProps {
  format: string;
  icon: React.ElementType;
  isBlock?: boolean;
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && n.type === format,
  });
  return !!match;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === "bulleted-list" || format === "numbered-list";

  Editor.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && n.type === "bulleted-list" || n.type === "numbered-list",
    split: true,
  });

  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };

  Editor.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Editor.wrapNodes(editor, block);
  }
};

const ToolbarButton = ({ format, icon: Icon, isBlock = false }: ToolbarButtonProps) => {
  const editor = useSlate();
  const isActive = isBlock ? isBlockActive(editor, format) : isMarkActive(editor, format);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isBlock) {
      toggleBlock(editor, format);
    } else {
      toggleMark(editor, format);
    }
  };

  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      onClick={handleClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

export const Toolbar = () => {
  return (
    <div className="flex gap-1 mb-2 border-b pb-2">
      <ToolbarButton format="bold" icon={Bold} />
      <ToolbarButton format="italic" icon={Italic} />
      <ToolbarButton format="underline" icon={Underline} />
      <ToolbarButton format="bulleted-list" icon={List} isBlock />
      <ToolbarButton format="numbered-list" icon={ListOrdered} isBlock />
    </div>
  );
};
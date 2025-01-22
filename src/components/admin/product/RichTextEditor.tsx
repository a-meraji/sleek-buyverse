import { useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Toolbar } from "./rich-text/Toolbar";
import { Element } from "./rich-text/Element";
import { Leaf } from "./rich-text/Leaf";
import { CustomElement } from "./rich-text/types";

const INITIAL_VALUE: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const initialValue = value?.length > 0 ? value : INITIAL_VALUE;

  return (
    <div className="border rounded-md p-4">
      <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter product description..."
          spellCheck
          className="min-h-[200px] focus:outline-none"
        />
      </Slate>
    </div>
  );
}
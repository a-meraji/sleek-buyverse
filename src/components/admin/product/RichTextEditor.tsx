import { useCallback, useMemo } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Toolbar } from './rich-text/Toolbar';
import { Element } from './rich-text/Element';
import { Leaf } from './rich-text/Leaf';
import { defaultValue } from './rich-text/types';

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const initialValue = useMemo(() => {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      console.warn('Invalid JSON in description, using default value');
      return defaultValue;
    }
  }, [value]);

  const handleChange = (newValue: Descendant[]) => {
    onChange(JSON.stringify(newValue));
  };

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <div className="border rounded-md">
        <Toolbar />
        <div className="px-3 py-2 min-h-[150px]">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter description..."
            spellCheck
          />
        </div>
      </div>
    </Slate>
  );
}
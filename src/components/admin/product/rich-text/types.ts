import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type CustomElement = {
  type: 'paragraph' | 'bulleted-list' | 'numbered-list' | 'list-item';
  children: Descendant[];
};

export type CustomEditor = BaseEditor & ReactEditor;

export const defaultValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
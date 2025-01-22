import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

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

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const defaultValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
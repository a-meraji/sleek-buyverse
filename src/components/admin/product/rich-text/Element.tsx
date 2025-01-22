import { CustomElement } from './types';

interface ElementProps {
  attributes: any;
  children: React.ReactNode;
  element: CustomElement;
}

export const Element = ({ attributes, children, element }: ElementProps) => {
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes} className="list-disc pl-6">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal pl-6">{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
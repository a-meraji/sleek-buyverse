import { Descendant } from "slate";

interface RichTextContentProps {
  content: string;
}

export function RichTextContent({ content }: RichTextContentProps) {
  const renderElement = (element: any) => {
    switch (element.type) {
      case 'block-quote':
        return <blockquote className="border-l-4 border-gray-300 pl-4 my-4">{element.children.map(renderNode)}</blockquote>;
      case 'bulleted-list':
        return <ul className="list-disc list-inside my-4">{element.children.map(renderNode)}</ul>;
      case 'heading-one':
        return <h1 className="text-2xl font-bold my-4">{element.children.map(renderNode)}</h1>;
      case 'heading-two':
        return <h2 className="text-xl font-bold my-3">{element.children.map(renderNode)}</h2>;
      case 'list-item':
        return <li className="my-1">{element.children.map(renderNode)}</li>;
      case 'numbered-list':
        return <ol className="list-decimal list-inside my-4">{element.children.map(renderNode)}</ol>;
      case 'paragraph':
        return <p className="my-2">{element.children.map(renderNode)}</p>;
      default:
        return <p className="my-2">{element.children.map(renderNode)}</p>;
    }
  };

  const renderLeaf = (leaf: any) => {
    let text = leaf.text;

    if (leaf.bold && leaf.italic && leaf.underline) {
      return <strong><em><u>{text}</u></em></strong>;
    }
    if (leaf.bold && leaf.italic) {
      return <strong><em>{text}</em></strong>;
    }
    if (leaf.bold && leaf.underline) {
      return <strong><u>{text}</u></strong>;
    }
    if (leaf.italic && leaf.underline) {
      return <em><u>{text}</u></em>;
    }
    if (leaf.bold) {
      return <strong>{text}</strong>;
    }
    if (leaf.italic) {
      return <em>{text}</em>;
    }
    if (leaf.underline) {
      return <u>{text}</u>;
    }

    return text;
  };

  const renderNode = (node: any) => {
    if ('text' in node) {
      return renderLeaf(node);
    }
    return renderElement(node);
  };

  try {
    const parsedContent: Descendant[] = JSON.parse(content);
    return (
      <div className="prose prose-sm max-w-none">
        {parsedContent.map((node, i) => (
          <div key={i}>{renderNode(node)}</div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Failed to parse rich text content:', error);
    // Fallback for plain text content
    return <p className="text-gray-600">{content}</p>;
  }
}
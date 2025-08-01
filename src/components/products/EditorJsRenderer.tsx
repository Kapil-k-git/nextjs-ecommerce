import React from "react";

type Block = {
  id: string;
  type: string;
  data: any;
};

type Props = {
  data: string; // JSON string from Editor.js
};

const EditorJsRenderer: React.FC<Props> = ({ data }) => {
  let blocks: Block[] = [];

  try {
    const parsed = JSON.parse(data);
    blocks = parsed.blocks || [];
  } catch (err) {
    console.error("Invalid Editor.js JSON", err);
    return <p>Error rendering content.</p>;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return <p key={block.id}>{block.data.text}</p>;

          // Add support for more block types here
          // case "header":
          //   return <h2 key={block.id}>{block.data.text}</h2>;

          default:
            return null;
        }
      })}
    </div>
  );
};

export default EditorJsRenderer;
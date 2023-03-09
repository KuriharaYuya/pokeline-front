import DOMPurify from "dompurify";
import { marked } from "marked";

type MarkdownPreviewProps = {
  markdown: string;
};
const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(markdown)),
      }}
    ></div>
  );
};
export default MarkdownPreview;

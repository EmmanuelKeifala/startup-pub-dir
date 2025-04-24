import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ markdownContent }: { markdownContent: string }) => {
  return (
    <div className="markdown-wrapper">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>

      <style jsx>{`
        .markdown-wrapper {
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        .markdown-wrapper :global(h1) {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .markdown-wrapper :global(h2) {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .markdown-wrapper :global(ul) {
          list-style-type: disc;
          padding-left: 2rem;
          margin: 1rem 0;
        }

        .markdown-wrapper :global(ol) {
          list-style-type: decimal;
          padding-left: 2rem;
          margin: 1rem 0;
        }

        .markdown-wrapper :global(li) {
          margin: 0.5rem 0;
        }

        .markdown-wrapper :global(blockquote) {
          border-left: 4px solid #e2e8f0;
          padding-left: 1rem;
          margin-left: 0;
          color: #4a5568;
        }

        .markdown-wrapper :global(p) {
          margin: 1rem 0;
        }

        .markdown-wrapper :global(a) {
          color: #3182ce;
          text-decoration: none;
        }

        .markdown-wrapper :global(a:hover) {
          text-decoration: underline;
        }

        .markdown-wrapper :global(strong) {
          font-weight: 700;
        }

        .markdown-wrapper :global(em) {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default MarkdownRenderer;

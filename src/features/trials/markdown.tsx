import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
export function StudyMarkdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

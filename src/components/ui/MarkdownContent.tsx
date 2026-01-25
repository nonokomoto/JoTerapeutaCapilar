import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownContentProps {
    content: string;
    className?: string;
}

/**
 * Renderiza markdown de forma segura com suporte a GFM (GitHub Flavored Markdown)
 * - Sanitiza HTML para prevenir XSS
 * - Suporta: headers, bold, italic, links, listas, code, blockquotes, tables, strikethrough
 * - Aplica classes do Design System automaticamente
 */
export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                    // Headers com classes do DS
                    h1: ({ node, ...props }) => (
                        <h1 className="ds-text-primary" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }} {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="ds-text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }} {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="ds-text-primary" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }} {...props} />
                    ),

                    // Links com target blank e DS colors
                    a: ({ node, ...props }) => (
                        <a className="ds-text-brand" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }} {...props} />
                    ),

                    // Listas
                    ul: ({ node, ...props }) => (
                        <ul style={{ marginLeft: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)', listStyleType: 'disc' }} {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol style={{ marginLeft: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)', listStyleType: 'decimal' }} {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li style={{ marginBottom: 'var(--spacing-1)' }} {...props} />
                    ),

                    // Code inline and blocks
                    code: ({ node, className, children, ...props }: any) => {
                        // Check if it's inline code (no className means inline)
                        const isInline = !className;

                        if (isInline) {
                            return (
                                <code
                                    className="ds-bg-muted"
                                    style={{
                                        padding: '2px 6px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                                        fontSize: '0.9em'
                                    }}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        // Code block
                        return (
                            <code
                                className={`ds-bg-muted ${className || ''}`}
                                style={{
                                    display: 'block',
                                    padding: 'var(--spacing-3)',
                                    borderRadius: 'var(--radius-md)',
                                    overflowX: 'auto',
                                    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                                    fontSize: '0.875rem'
                                }}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // Pre wrapper for code blocks
                    pre: ({ node, ...props }) => (
                        <pre style={{ margin: 'var(--spacing-3) 0' }} {...props} />
                    ),

                    // Blockquotes
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="ds-text-secondary ds-border-accent"
                            style={{
                                borderLeft: '3px solid var(--color-taupe)',
                                paddingLeft: 'var(--spacing-3)',
                                marginLeft: 0,
                                marginTop: 'var(--spacing-3)',
                                marginBottom: 'var(--spacing-3)',
                                fontStyle: 'italic'
                            }}
                            {...props}
                        />
                    ),

                    // Tables (GFM)
                    table: ({ node, ...props }) => (
                        <div style={{ overflowX: 'auto', marginBottom: 'var(--spacing-3)' }}>
                            <table
                                className="ds-border-default"
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    border: '1px solid var(--border-default)'
                                }}
                                {...props}
                            />
                        </div>
                    ),
                    th: ({ node, ...props }) => (
                        <th
                            className="ds-bg-secondary ds-text-primary"
                            style={{
                                padding: 'var(--spacing-2)',
                                textAlign: 'left',
                                borderBottom: '2px solid var(--border-default)'
                            }}
                            {...props}
                        />
                    ),
                    td: ({ node, ...props }) => (
                        <td
                            style={{
                                padding: 'var(--spacing-2)',
                                borderBottom: '1px solid var(--border-subtle)'
                            }}
                            {...props}
                        />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                        <p style={{ marginBottom: 'var(--spacing-2)' }} {...props} />
                    ),

                    // Strong (bold)
                    strong: ({ node, ...props }) => (
                        <strong className="ds-text-primary" style={{ fontWeight: 600 }} {...props} />
                    ),

                    // Em (italic)
                    em: ({ node, ...props }) => (
                        <em style={{ fontStyle: 'italic' }} {...props} />
                    ),

                    // Horizontal rule
                    hr: ({ node, ...props }) => (
                        <hr className="ds-border-subtle" style={{ margin: 'var(--spacing-4) 0', border: 'none', borderTop: '1px solid var(--border-subtle)' }} {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

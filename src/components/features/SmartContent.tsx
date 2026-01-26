"use client";

import { Fragment } from "react";

interface SmartContentProps {
    content: string;
    className?: string;
}

// Regex para detectar URLs
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Regex para detectar imagens inline [imagem: url]
const IMAGE_REGEX = /\[imagem:\s*(https?:\/\/[^\]]+)\]/g;

// Detecta se uma linha é um item de lista
function isListItem(line: string): { type: 'bullet' | 'number' | null; content: string } {
    const trimmed = line.trim();

    // Bullet list: - item ou • item ou * item
    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)$/);
    if (bulletMatch) {
        return { type: 'bullet', content: bulletMatch[1] };
    }

    // Numbered list: 1. item ou 1) item
    const numberMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (numberMatch) {
        return { type: 'number', content: numberMatch[1] };
    }

    return { type: null, content: trimmed };
}

// Verifica se uma linha é uma imagem inline
function isInlineImage(line: string): { isImage: boolean; url: string } {
    const match = line.trim().match(/^\[imagem:\s*(https?:\/\/[^\]]+)\]$/);
    if (match) {
        return { isImage: true, url: match[1] };
    }
    return { isImage: false, url: "" };
}

// Renderiza texto com links clicáveis e imagens inline
function renderTextWithLinks(text: string): React.ReactNode {
    // First check for inline images in the text
    const imageMatch = text.match(IMAGE_REGEX);
    if (imageMatch) {
        // Split by image tags and render
        const parts = text.split(IMAGE_REGEX);
        const urls: string[] = [];
        let match;
        const regex = new RegExp(IMAGE_REGEX.source, 'g');
        while ((match = regex.exec(text)) !== null) {
            urls.push(match[1]);
        }

        return parts.map((part, index) => {
            const elements: React.ReactNode[] = [];

            // Add text part with links
            if (part) {
                const textParts = part.split(URL_REGEX);
                textParts.forEach((textPart, textIndex) => {
                    if (textPart.match(URL_REGEX)) {
                        elements.push(
                            <a
                                key={`link-${index}-${textIndex}`}
                                href={textPart}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="smart-content-link"
                            >
                                {textPart}
                            </a>
                        );
                    } else if (textPart) {
                        elements.push(<Fragment key={`text-${index}-${textIndex}`}>{textPart}</Fragment>);
                    }
                });
            }

            // Add image if there's a corresponding URL
            if (urls[index]) {
                elements.push(
                    <span key={`img-${index}`} className="smart-content-image-wrapper">
                        <img
                            src={urls[index]}
                            alt="Imagem do artigo"
                            className="smart-content-image"
                            loading="lazy"
                        />
                    </span>
                );
            }

            return <Fragment key={index}>{elements}</Fragment>;
        });
    }

    // No images, just process links
    const parts = text.split(URL_REGEX);

    return parts.map((part, index) => {
        if (part.match(URL_REGEX)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="smart-content-link"
                >
                    {part}
                </a>
            );
        }
        return <Fragment key={index}>{part}</Fragment>;
    });
}

// Agrupa linhas consecutivas do mesmo tipo de lista
function groupListItems(lines: string[]): Array<{ type: 'paragraph' | 'bullet-list' | 'number-list'; items: string[] }> {
    const groups: Array<{ type: 'paragraph' | 'bullet-list' | 'number-list'; items: string[] }> = [];
    let currentGroup: { type: 'paragraph' | 'bullet-list' | 'number-list'; items: string[] } | null = null;

    for (const line of lines) {
        const { type, content } = isListItem(line);

        if (type === 'bullet') {
            if (currentGroup?.type === 'bullet-list') {
                currentGroup.items.push(content);
            } else {
                if (currentGroup) groups.push(currentGroup);
                currentGroup = { type: 'bullet-list', items: [content] };
            }
        } else if (type === 'number') {
            if (currentGroup?.type === 'number-list') {
                currentGroup.items.push(content);
            } else {
                if (currentGroup) groups.push(currentGroup);
                currentGroup = { type: 'number-list', items: [content] };
            }
        } else if (content) {
            if (currentGroup?.type === 'paragraph') {
                currentGroup.items.push(content);
            } else {
                if (currentGroup) groups.push(currentGroup);
                currentGroup = { type: 'paragraph', items: [content] };
            }
        }
    }

    if (currentGroup) groups.push(currentGroup);
    return groups;
}

export function SmartContent({ content, className }: SmartContentProps) {
    if (!content) return null;

    // Divide por parágrafos (linhas em branco)
    const paragraphs = content.split(/\n\s*\n/);

    return (
        <div className={`smart-content ${className || ''}`}>
            {paragraphs.map((paragraph, pIndex) => {
                const lines = paragraph.split('\n').filter(line => line.trim());
                const groups = groupListItems(lines);

                return (
                    <div key={pIndex} className="smart-content-paragraph">
                        {groups.map((group, gIndex) => {
                            if (group.type === 'bullet-list') {
                                return (
                                    <ul key={gIndex} className="smart-content-list">
                                        {group.items.map((item, iIndex) => (
                                            <li key={iIndex}>{renderTextWithLinks(item)}</li>
                                        ))}
                                    </ul>
                                );
                            }

                            if (group.type === 'number-list') {
                                return (
                                    <ol key={gIndex} className="smart-content-list smart-content-list-numbered">
                                        {group.items.map((item, iIndex) => (
                                            <li key={iIndex}>{renderTextWithLinks(item)}</li>
                                        ))}
                                    </ol>
                                );
                            }

                            // Parágrafo normal
                            return (
                                <p key={gIndex}>
                                    {group.items.map((line, lIndex) => (
                                        <Fragment key={lIndex}>
                                            {lIndex > 0 && <br />}
                                            {renderTextWithLinks(line)}
                                        </Fragment>
                                    ))}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

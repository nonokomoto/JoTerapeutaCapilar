"use client";

import { Icon } from "@/components/ui";

interface BeforeAfterComparison {
    id: string;
    before_image_url: string;
    before_date: string;
    before_label: string;
    after_image_url: string;
    after_date: string;
    after_label: string;
    title: string | null;
    description: string | null;
}

interface BeforeAfterPreviewProps {
    comparison: BeforeAfterComparison | null;
}

export function BeforeAfterPreview({ comparison }: BeforeAfterPreviewProps) {
    // Don't render if no comparison exists
    if (!comparison) return null;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-PT", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="before-after-preview">
            <div className="before-after-header">
                <div className="before-after-title-row">
                    <Icon name="image" size={20} />
                    <h3 className="before-after-title">A Minha Evolução</h3>
                </div>
            </div>

            <div className="before-after-images">
                <div className="before-after-image-container">
                    <img
                        src={comparison.before_image_url}
                        alt={comparison.before_label || "Antes"}
                        className="before-after-image"
                    />
                    <div className="before-after-image-label">
                        <span className="before-after-label-text">{comparison.before_label || "Antes"}</span>
                        <span className="before-after-label-date">{formatDate(comparison.before_date)}</span>
                    </div>
                </div>

                <div className="before-after-arrow">
                    <Icon name="arrow-right" size={24} />
                </div>

                <div className="before-after-image-container">
                    <img
                        src={comparison.after_image_url}
                        alt={comparison.after_label || "Depois"}
                        className="before-after-image"
                    />
                    <div className="before-after-image-label">
                        <span className="before-after-label-text">{comparison.after_label || "Depois"}</span>
                        <span className="before-after-label-date">{formatDate(comparison.after_date)}</span>
                    </div>
                </div>
            </div>

            {comparison.title && (
                <p className="before-after-description">{comparison.title}</p>
            )}
        </div>
    );
}

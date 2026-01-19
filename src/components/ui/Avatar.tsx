import Image from "next/image";

export interface AvatarProps {
    src?: string | null;
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

function getInitials(name: string): string {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({
    src,
    name,
    size = "md",
    className = "",
}: AvatarProps) {
    const sizeClass = `avatar-${size}`;
    const dimensions = {
        sm: 32,
        md: 40,
        lg: 56,
        xl: 80,
    };

    return (
        <div className={`avatar ${sizeClass} ${className}`}>
            {src ? (
                <Image
                    src={src}
                    alt={name}
                    width={dimensions[size]}
                    height={dimensions[size]}
                    className="object-cover"
                />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
}

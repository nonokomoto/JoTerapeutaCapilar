"use client";

interface LogoProps {
    className?: string;
    size?: "header" | "footer";
    subtitle?: string;
}

export function Logo({ className = "", size = "header", subtitle = "TERAPEUTA CAPILAR" }: LogoProps) {
    const height = size === "header" ? 70 : 50;
    const width = size === "header" ? 180 : 130;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 180 55"
            width={width}
            height={height}
            className={`logo-svg ${className}`}
            aria-label="Josianne Gomes - Terapeuta Capilar"
        >
            {/* Nome: Josianne Gomes - Tipografia feminina elegante */}
            <text
                className="logo-name"
                x="90"
                y="28"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="26"
                fontStyle="italic"
                fontWeight="500"
                textAnchor="middle"
            >
                Josianne Gomes
            </text>

            {/* Subtítulo: Terapeuta Capilar */}
            <text
                className="logo-subtitle"
                x="90"
                y="48"
                fontFamily="'Poppins', Arial, sans-serif"
                fontSize="9"
                fontWeight="400"
                letterSpacing="0.18em"
                textAnchor="middle"
            >
                {subtitle}
            </text>
        </svg>
    );
}

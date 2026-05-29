interface FlagIconProps {
    code: "fr" | "gb";
    className?: string;
}

export function FlagIcon({ code, className = "" }: FlagIconProps) {
    if (code === "fr") {
        return (
            <svg
                className={`cv-flag-icon ${className}`.trim()}
                viewBox="0 0 24 16"
                aria-hidden
                focusable="false"
            >
                <rect width="8" height="16" fill="#002395" />
                <rect x="8" width="8" height="16" fill="#ffffff" />
                <rect x="16" width="8" height="16" fill="#ed2939" />
            </svg>
        );
    }

    return (
        <svg
            className={`cv-flag-icon ${className}`.trim()}
            viewBox="0 0 24 16"
            aria-hidden
            focusable="false"
        >
            <rect width="24" height="16" fill="#012169" />
            <path d="M0 0 L24 16 M24 0 L0 16" stroke="#ffffff" strokeWidth="3.2" />
            <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.6" />
            <path d="M12 0 V16 M0 8 H24" stroke="#ffffff" strokeWidth="5.2" />
            <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3.2" />
        </svg>
    );
}

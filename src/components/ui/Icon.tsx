import { LucideProps } from "lucide-react";
import {
    ArrowLeft,
    ChevronRight,
    FileText,
    ImageIcon,
    Loader2,
    Paperclip,
    Plus,
    Save,
    Search,
    Send,
    Trash2,
    Upload,
    Users,
    X,
    Home,
    Settings,
    LogOut,
    Menu,
    Bell,
    Calendar,
    CalendarX,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    Eye,
    EyeOff,
    Edit,
    Copy,
    Download,
    ExternalLink,
    Filter,
    MoreVertical,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    RefreshCw,
    Mail,
    Phone,
    User,
    UserCheck,
    UserX,
    Heart,
    Star,
    Bookmark,
    Share,
    Camera,
    Sparkles,
} from "lucide-react";
import { forwardRef, ComponentType } from "react";

// Map of all available icons
const iconMap = {
    "arrow-left": ArrowLeft,
    "chevron-right": ChevronRight,
    "chevron-left": ChevronLeft,
    "chevron-down": ChevronDown,
    "chevron-up": ChevronUp,
    "file-text": FileText,
    image: ImageIcon,
    loader: Loader2,
    paperclip: Paperclip,
    plus: Plus,
    save: Save,
    search: Search,
    send: Send,
    trash: Trash2,
    upload: Upload,
    users: Users,
    x: X,
    close: X,
    home: Home,
    settings: Settings,
    logout: LogOut,
    menu: Menu,
    bell: Bell,
    calendar: Calendar,
    "calendar-x": CalendarX,
    clock: Clock,
    check: CheckCircle,
    alert: AlertCircle,
    info: Info,
    eye: Eye,
    "eye-off": EyeOff,
    edit: Edit,
    copy: Copy,
    download: Download,
    "external-link": ExternalLink,
    filter: Filter,
    "more-vertical": MoreVertical,
    "more-horizontal": MoreHorizontal,
    refresh: RefreshCw,
    mail: Mail,
    phone: Phone,
    user: User,
    "user-check": UserCheck,
    "user-x": UserX,
    heart: Heart,
    star: Star,
    bookmark: Bookmark,
    share: Share,
    camera: Camera,
    sparkles: Sparkles,
} as const;

export type IconName = keyof typeof iconMap;

export interface IconProps extends Omit<LucideProps, "ref"> {
    name: IconName;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
    className?: string;
}

const sizeMap = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ name, size = "md", className = "", ...props }, ref) => {
        const IconComponent = iconMap[name] as ComponentType<LucideProps>;

        if (!IconComponent) {
            console.warn(`Icon "${name}" not found`);
            return null;
        }

        const pixelSize = typeof size === "number" ? size : sizeMap[size];

        return (
            <IconComponent
                ref={ref}
                size={pixelSize}
                className={className}
                aria-hidden="true"
                {...props}
            />
        );
    }
);

Icon.displayName = "Icon";

// Re-export individual icons for direct usage when needed
export {
    ArrowLeft,
    ChevronRight,
    FileText,
    ImageIcon,
    Loader2,
    Paperclip,
    Plus,
    Save,
    Search,
    Send,
    Trash2,
    Upload,
    Users,
    X,
    Home,
    Settings,
    LogOut,
    Menu,
    Bell,
    Calendar,
    CalendarX,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    Eye,
    EyeOff,
    Edit,
    Copy,
    Download,
    ExternalLink,
    Filter,
    MoreVertical,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    RefreshCw,
    Mail,
    Phone,
    User,
    UserCheck,
    UserX,
    Heart,
    Star,
    Bookmark,
    Share,
    Camera,
    Sparkles,
};

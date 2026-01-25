interface DateGroupHeaderProps {
    label: string;
    count: number;
}

export function DateGroupHeader({ label, count }: DateGroupHeaderProps) {
    return (
        <div className="date-group-header">
            <div className="flex items-center justify-between">
                <h3 className="date-group-title">
                    {label}
                </h3>
                <span className="date-group-count">
                    {count} {count === 1 ? 'atualização' : 'atualizações'}
                </span>
            </div>
        </div>
    );
}

"use client";

interface UpdatesStatsProps {
    totalCount: number;
    monthsCount: number;
    unreadCount: number;
}

function FileTextIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

export function UpdatesStats({ totalCount, monthsCount, unreadCount }: UpdatesStatsProps) {
    return (
        <div className="updates-stats">
            <div className="updates-stat-item">
                <div className="updates-stat-icon">
                    <FileTextIcon />
                </div>
                <div className="updates-stat-content">
                    <span className="updates-stat-value">{totalCount}</span>
                    <span className="updates-stat-label">
                        {totalCount === 1 ? "atualização" : "atualizações"}
                    </span>
                </div>
            </div>

            <div className="updates-stat-divider" />

            <div className="updates-stat-item">
                <div className="updates-stat-icon">
                    <CalendarIcon />
                </div>
                <div className="updates-stat-content">
                    <span className="updates-stat-value">{monthsCount}</span>
                    <span className="updates-stat-label">
                        {monthsCount === 1 ? "mês" : "meses"}
                    </span>
                </div>
            </div>

            <div className="updates-stat-divider" />

            <div className={`updates-stat-item ${unreadCount > 0 ? 'has-unread' : ''}`}>
                <div className={`updates-stat-icon ${unreadCount > 0 ? 'pulse' : ''}`}>
                    <BellIcon />
                </div>
                <div className="updates-stat-content">
                    <span className="updates-stat-value">{unreadCount}</span>
                    <span className="updates-stat-label">
                        {unreadCount === 1 ? "nova" : "novas"}
                    </span>
                </div>
            </div>
        </div>
    );
}

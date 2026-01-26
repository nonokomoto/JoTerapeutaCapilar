"use client";

import { useState } from "react";
import type { Appointment } from "@/types/database";

// Icons
function ChevronDownIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

interface AppointmentHistoryProps {
    appointments: Appointment[];
}

interface GroupedByYear {
    year: number;
    months: {
        month: string;
        appointments: Appointment[];
    }[];
    total: number;
}

function groupAppointmentsByYear(appointments: Appointment[]): GroupedByYear[] {
    const grouped: Record<number, Record<string, Appointment[]>> = {};

    appointments.forEach((apt) => {
        const date = new Date(apt.appointment_date);
        const year = date.getFullYear();
        const month = date.toLocaleDateString("pt-PT", { month: "long" });

        if (!grouped[year]) {
            grouped[year] = {};
        }
        if (!grouped[year][month]) {
            grouped[year][month] = [];
        }
        grouped[year][month].push(apt);
    });

    // Convert to array and sort by year descending
    return Object.entries(grouped)
        .map(([year, months]) => ({
            year: parseInt(year),
            months: Object.entries(months).map(([month, apts]) => ({
                month: month.charAt(0).toUpperCase() + month.slice(1),
                appointments: apts,
            })),
            total: Object.values(months).flat().length,
        }))
        .sort((a, b) => b.year - a.year);
}

export function AppointmentHistory({ appointments }: AppointmentHistoryProps) {
    const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
    const [showAll, setShowAll] = useState(false);

    if (appointments.length === 0) {
        return null;
    }

    const groupedByYear = groupAppointmentsByYear(appointments);
    const displayedYears = showAll ? groupedByYear : groupedByYear.slice(0, 2);

    const toggleYear = (year: number) => {
        const newExpanded = new Set(expandedYears);
        if (newExpanded.has(year)) {
            newExpanded.delete(year);
        } else {
            newExpanded.add(year);
        }
        setExpandedYears(newExpanded);
    };

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.completed).length;

    return (
        <div className="apt-history">
            <div className="apt-history-header">
                <h3 className="apt-history-title">Histórico</h3>
                <span className="apt-history-count">
                    {completedAppointments} de {totalAppointments} realizadas
                </span>
            </div>

            <div className="apt-history-years">
                {displayedYears.map(({ year, months, total }) => {
                    const isExpanded = expandedYears.has(year);

                    return (
                        <div key={year} className="apt-history-year">
                            <button
                                type="button"
                                className="apt-history-year-header"
                                onClick={() => toggleYear(year)}
                            >
                                <span className="apt-history-year-icon">
                                    {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                </span>
                                <span className="apt-history-year-label">{year}</span>
                                <span className="apt-history-year-count">
                                    {total} {total === 1 ? "consulta" : "consultas"}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="apt-history-months">
                                    {months.map(({ month, appointments: monthApts }) => (
                                        <div key={month} className="apt-history-month">
                                            <div className="apt-history-month-header">
                                                <span className="apt-history-month-label">{month}</span>
                                                <span className="apt-history-month-count">
                                                    {monthApts.length}
                                                </span>
                                            </div>

                                            <div className="apt-history-items">
                                                {monthApts.map((apt) => {
                                                    const date = new Date(apt.appointment_date);
                                                    return (
                                                        <div key={apt.id} className="apt-history-item">
                                                            <span className="apt-history-item-date">
                                                                {date.getDate()}
                                                            </span>
                                                            <span className="apt-history-item-type">
                                                                {apt.appointment_type || "Consulta"}
                                                            </span>
                                                            <span className={`apt-history-item-status ${apt.completed ? 'completed' : 'missed'}`}>
                                                                {apt.completed ? <CheckIcon /> : <XIcon />}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {groupedByYear.length > 2 && !showAll && (
                <button
                    type="button"
                    className="apt-history-show-more"
                    onClick={() => setShowAll(true)}
                >
                    Ver histórico completo ({groupedByYear.length - 2} anos anteriores)
                </button>
            )}
        </div>
    );
}

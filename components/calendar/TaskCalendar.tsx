"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface Task {
    id: string;
    description: string;
    hoursSpent: string;
    submissionStatus: string;
    taskDate: string;
}

interface CalendarProps {
    tasks: Task[];
    onAddTask: (date: string) => void;
}

export function TaskCalendar({ tasks, onAddTask }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthName = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: Array<{
        day: number;
        isCurrentMonth: boolean;
        date: Date;
    }> = [];

    // Only current month days - no padding from previous or next months
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        });
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get yesterday, today, and tomorrow dates as strings
    const getDateString = (offset: number) => {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const yesterdayStr = getDateString(-1);
    const todayStr = getDateString(0);
    const tomorrowStr = getDateString(1);

    const isDateEnabled = (dateStr: string) => {
        return dateStr === yesterdayStr || dateStr === todayStr || dateStr === tomorrowStr;
    };

    const getDateColorClasses = (dateStr: string) => {
        if (dateStr === todayStr) {
            return {
                container: "bg-green-100 border-green-200 hover:border-green-400",
                text: "text-green-700",
                label: "text-green-700 font-bold"
            };
        } else if (dateStr === yesterdayStr) {
            return {
                container: "bg-blue-100 border-blue-200 hover:border-blue-300",
                text: "text-blue-700",
                label: "text-blue-700 font-semibold"
            };
        } else if (dateStr === tomorrowStr) {
            return {
                container: "bg-violet-100 border-violet-200 hover:border-violet-300",
                text: "text-violet-700",
                label: "text-violet-700 font-semibold"
            };
        }
        return {
            container: "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed",
            text: "text-gray-400",
            label: "text-gray-400"
        };
    };

    return (
        <div className="bg-white rounded-lg shadow p-8">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Today
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ChevronRight size={24} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-4 mb-4">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center font-semibold text-gray-600 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-4">
                {days.map((dayObj, idx) => {
                    const year = dayObj.date.getFullYear();
                    const month = String(dayObj.date.getMonth() + 1).padStart(2, '0');
                    const day = String(dayObj.date.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    const dayTasks = tasks.filter((t) => t.taskDate === dateStr);
                    const isEnabled = isDateEnabled(dateStr);
                    const colors = getDateColorClasses(dateStr);

                    return (
                        <div
                            key={idx}
                            onClick={() => isEnabled && onAddTask(dateStr)}
                            className={`min-h-32 p-3 rounded-lg border-2 transition ${colors.container} ${isEnabled ? "cursor-pointer" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`font-semibold ${colors.label}`}>
                                        {dayObj.day}
                                    </span>
                                </div>
                            </div>

                            {dayTasks.length > 0 ? (
                                <p className={`text-xs ${colors.text}`}>{dayTasks.length} tasks</p>
                            ) : (
                                <p className={`text-xs ${colors.text}`}>No tasks</p>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}

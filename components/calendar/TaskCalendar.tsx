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
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

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

    // Previous month days
    const prevMonthDays = getDaysInMonth(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
            day: prevMonthDays - i,
            isCurrentMonth: false,
            date: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                prevMonthDays - i
            ),
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                i
            ),
        });
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
                    const dateStr = dayObj.date.toISOString().split("T")[0];
                    const dayTasks = tasks.filter((t) => t.taskDate === dateStr);

                    return (
                        <div
                            key={idx}
                            className={`min-h-32 p-3 rounded-lg border-2 transition ${dayObj.isCurrentMonth
                                ? "bg-white border-gray-200 hover:border-blue-300"
                                : "bg-gray-50 border-gray-100 text-gray-400"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">
                                        {dayObj.day}
                                    </span>
                                    {dayTasks.length > 0 && (
                                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                                            {dayTasks.length}
                                        </span>
                                    )}
                                </div>
                                {dayObj.isCurrentMonth && (
                                    <button
                                        onClick={() => onAddTask(dateStr)}
                                        className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
                                    >
                                        <Plus size={18} />
                                    </button>
                                )}
                            </div>

                            {dayTasks.length > 0 ? (
                                <div className="space-y-1">
                                    {dayTasks.slice(0, 2).map((task) => (
                                        <div
                                            key={task.id}
                                            className="text-xs bg-blue-50 text-blue-700 p-1 rounded truncate"
                                        >
                                            {task.description}
                                        </div>
                                    ))}
                                    {dayTasks.length > 2 && (
                                        <p className="text-xs text-gray-500">
                                            {dayTasks.length - 2} more
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">No tasks</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

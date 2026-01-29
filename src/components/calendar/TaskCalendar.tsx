'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    taskCount?: number;
    isToday?: boolean;
}

interface TaskCalendarProps {
    tasks?: { [key: string]: number }; // date string -> task count
    onDateClick: (date: Date) => void;
}

export function TaskCalendar({ tasks = {}, onDateClick }: TaskCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getPreviousMonthDays = (date: Date) => {
        const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
        const daysInPrevMonth = getDaysInMonth(prevMonth);
        const firstDayOfMonth = getFirstDayOfMonth(date);
        return daysInPrevMonth - firstDayOfMonth + 1;
    };

    const generateCalendarDays = (): CalendarDay[] => {
        const days: CalendarDay[] = [];
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const prevMonthStartDay = getPreviousMonthDays(currentDate);

        // Previous month days
        for (let i = prevMonthStartDay; i <= prevMonthStartDay + firstDay - 1; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, i);
            days.push({
                date,
                isCurrentMonth: false,
            });
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateKey = date.toISOString().split('T')[0];
            const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            days.push({
                date,
                isCurrentMonth: true,
                taskCount: tasks[dateKey],
                isToday,
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
            days.push({
                date,
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const calendarDays = generateCalendarDays();
    const monthYear = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{monthYear}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handlePreviousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Previous month"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Next month"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-sm font-semibold text-gray-600 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => (
                    <div
                        key={idx}
                        onClick={() => {
                            if (day.isCurrentMonth) {
                                onDateClick(day.date);
                            }
                        }}
                        className={`
              min-h-24 p-2 rounded-lg border transition-all relative cursor-pointer
              ${!day.isCurrentMonth
                                ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                                : day.isToday
                                    ? 'bg-blue-50 border-blue-300 hover:shadow-md'
                                    : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-200'
                            }
            `}
                    >
                        {/* Date Number */}
                        <div className="text-right mb-1">
                            <span
                                className={`
                  text-sm font-semibold
                  ${day.isToday ? 'text-blue-600' : 'text-gray-900'}
                `}
                            >
                                {day.date.getDate()}
                            </span>
                            {day.isToday && (
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mx-auto mt-0.5"></div>
                            )}
                        </div>

                        {/* Tasks Count */}
                        {day.taskCount && day.taskCount > 0 ? (
                            <div className="mt-1">
                                <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                                    {day.taskCount} task{day.taskCount !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ) : day.isCurrentMonth ? (
                            <div className="mt-1 text-xs text-gray-400">No tasks</div>
                        ) : null}

                        {/* Add Task Button */}
                        {day.isCurrentMonth && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDateClick(day.date);
                                }}
                                className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Add task"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-600">Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 rounded"></div>
                        <span className="text-gray-600">Has tasks</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

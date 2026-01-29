'use client';

import React, { useState, useEffect } from 'react';
import { TaskCalendar } from '@/src/components/calendar/TaskCalendar';
import { TaskModal } from '@/src/components/modals/TaskModal';
import { EmployeeTaskTable } from '@/src/components/tables/EmployeeTaskTable';
import { Calendar, ListTodo } from 'lucide-react';

interface Task {
    id: number;
    taskDate: Date;
    title: string;
    description?: string;
    hours: number;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    priority: 'low' | 'medium' | 'high';
    category?: string;
    completionPercentage: number;
    createdAt?: Date;
}

export default function EmployeeTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const employeeId = 1;

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/tasks?employeeId=${employeeId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            if (data.success && data.tasks) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData: any) => {
        try {
            if (!selectedDate) return;

            // Call API to create task
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId,
                    taskDate: selectedDate,
                    title: formData.title,
                    description: formData.description,
                    hours: formData.hours,
                    priority: formData.priority,
                    category: formData.category,
                    completionPercentage: formData.completionPercentage,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Failed to create task:', error);
                return;
            }

            const data = await response.json();

            if (data.success && data.task) {
                setTasks((prev) => [data.task, ...prev]);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    const getTasksByDate = (date: Date): Task[] => {
        return tasks.filter((task) => {
            const taskDate = new Date(task.taskDate);
            return (
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const getTasksCountByDate = (): { [key: string]: number } => {
        const counts: { [key: string]: number } = {};
        tasks.forEach((task) => {
            const dateKey = new Date(task.taskDate).toISOString().split('T')[0];
            counts[dateKey] = (counts[dateKey] || 0) + 1;
        });
        return counts;
    };

    const handleEdit = (taskId: number) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.status === 'draft') {
            setSelectedDate(new Date(task.taskDate));
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (taskId: number) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error('Failed to delete task');
                return;
            }

            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleSubmit = async (taskId: number) => {
        try {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) return;

            // Find manager ID - in this case hardcoded to 2
            const managerId = 2;

            // Call API to submit task for approval
            const response = await fetch(`/api/tasks/${taskId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    managerId,
                    employeeId: employeeId,
                }),
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                console.error('Failed to submit task - API Error:', {
                    status: response.status,
                    error: responseData.error,
                    details: responseData.details,
                    fullResponse: responseData
                });
                alert(`Error: ${responseData.error || 'Failed to submit task'}`);
                return;
            }

            // Update local state
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskId ? { ...t, status: 'submitted' } : t
                )
            );
            alert('Task submitted for approval!');
        } catch (error) {
            console.error('Failed to submit task:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Failed to submit'}`);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return task.status === 'draft';
        if (filter === 'approved') return task.status === 'approved';
        if (filter === 'rejected') return task.status === 'rejected';
        return true;
    });

    const draftCount = tasks.filter((t) => t.status === 'draft').length;
    const pendingCount = tasks.filter((t) => t.status === 'submitted').length;
    const approvedCount = tasks.filter((t) => t.status === 'approved').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Daily Tasks</h1>
                    <p className="text-gray-600 mt-1">
                        Manage and track your daily work updates
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'calendar'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <Calendar className="w-5 h-5" />
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <ListTodo className="w-5 h-5" />
                        List
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Draft Tasks</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{draftCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Ready to submit</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Approved</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">This week</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Total Hours</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {tasks.reduce((sum, t) => sum + t.hours, 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">This week</p>
                </div>
            </div>

            {/* View Toggle */}
            {viewMode === 'calendar' ? (
                <>
                    {/* Calendar View */}
                    <TaskCalendar
                        tasks={getTasksCountByDate()}
                        onDateClick={handleDateClick}
                    />

                    {/* Task Modal */}
                    <TaskModal
                        date={selectedDate}
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedDate(null);
                        }}
                        onSubmit={handleModalSubmit}
                        existingTasks={selectedDate ? getTasksByDate(selectedDate) : []}
                    />

                    {/* Important Notes */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900">How to Use</h3>
                                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                                    <li>• Click on any date to add a task</li>
                                    <li>• You can add multiple tasks for the same date</li>
                                    <li>• Only past week and current week dates are available</li>
                                    <li>• Green badges show task count for that day</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            All ({tasks.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Draft ({draftCount})
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'approved'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Approved ({approvedCount})
                        </button>
                    </div>

                    {/* List View */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Task List</h2>
                        <EmployeeTaskTable
                            tasks={filteredTasks.map(task => ({
                                ...task,
                                createdAt: typeof task.createdAt === 'string' ? task.createdAt : task.createdAt?.toISOString()
                            }))}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

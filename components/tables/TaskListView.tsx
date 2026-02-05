"use client";

import { useState } from "react";

interface Task {
    id: string;
    description: string;
    hoursSpent: string;
    submissionStatus: string;
    taskDate: string;
}

interface TaskListViewProps {
    tasks: Task[];
    loading: boolean;
}

export function TaskListView({ tasks, loading }: TaskListViewProps) {
    const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "approved">("all");

    // Filter tasks based on status
    const filteredTasks = tasks.filter((task) => {
        if (filterStatus === "all") return true;
        return task.submissionStatus === filterStatus;
    });

    return (
        <div>
            {/* Filter Tabs */}
            <div className="mb-6 flex gap-3">
                <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    All ({tasks.length})
                </button>
                <button
                    onClick={() => setFilterStatus("draft")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === "draft"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Draft ({tasks.filter(t => t.submissionStatus === "draft").length})
                </button>
                <button
                    onClick={() => setFilterStatus("approved")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === "approved"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Approved ({tasks.filter(t => t.submissionStatus === "approved").length})
                </button>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading tasks...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">
                            {filterStatus === "all" 
                                ? "No tasks created yet. Select a date in the calendar to create a task."
                                : `No ${filterStatus} tasks found.`}
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hours</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(task.taskDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{task.description.substring(0, 30)}</div>
                                        <div className="text-xs text-gray-500">{task.description.substring(30, 60)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{task.hoursSpent}h</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            task.submissionStatus === 'draft' 
                                                ? 'bg-gray-100 text-gray-800'
                                                : task.submissionStatus === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {task.submissionStatus === 'draft' && '📋'} {task.submissionStatus.charAt(0).toUpperCase() + task.submissionStatus.slice(1)}
                                        </span>
                                    </td>
                                  
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="text-blue-600 hover:text-blue-900 transition">
                                                ✏️
                                            </button>
                                            <button className="text-green-600 hover:text-green-900 transition">
                                                ✓
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 transition">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

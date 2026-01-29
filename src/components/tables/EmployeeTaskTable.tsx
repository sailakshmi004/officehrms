'use client';

import React from 'react';
import {
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Edit2,
    Trash2,
    FileText,
} from 'lucide-react';

interface Task {
    id: number;
    taskDate: string | Date;
    title: string;
    description?: string;
    hours: number;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    priority: 'low' | 'medium' | 'high';
    category?: string;
    completionPercentage: number;
    createdAt?: string;
}

interface EmployeeTaskTableProps {
    tasks: Task[];
    onEdit?: (taskId: number) => void;
    onDelete?: (taskId: number) => void;
    onView?: (taskId: number) => void;
    onSubmit?: (taskId: number) => void;
    isLoading?: boolean;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'approved':
            return 'bg-green-100 text-green-800 border-green-300';
        case 'rejected':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'submitted':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'draft':
            return 'bg-gray-100 text-gray-800 border-gray-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'approved':
            return <CheckCircle className="w-4 h-4" />;
        case 'rejected':
            return <AlertCircle className="w-4 h-4" />;
        case 'submitted':
            return <Clock className="w-4 h-4" />;
        default:
            return <FileText className="w-4 h-4" />;
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'text-red-600 bg-red-50';
        case 'medium':
            return 'text-yellow-600 bg-yellow-50';
        case 'low':
            return 'text-green-600 bg-green-50';
        default:
            return 'text-gray-600 bg-gray-50';
    }
};

export function EmployeeTaskTable({
    tasks,
    onEdit,
    onDelete,
    onView,
    onSubmit,
    isLoading = false,
}: EmployeeTaskTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No tasks found</p>
                <p className="text-sm text-gray-500">Create your first daily task update</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hours</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                {new Date(task.taskDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </td>
                            <td className="px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                    {task.category && (
                                        <p className="text-xs text-gray-500">{task.category}</p>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {task.hours}h
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-block px-3 py-1 rounded text-xs font-medium ${getPriorityColor(
                                        task.priority
                                    )}`}
                                >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                        task.status
                                    )}`}
                                >
                                    {getStatusIcon(task.status)}
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{
                                                width: `${task.completionPercentage}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 w-10 text-right">
                                        {task.completionPercentage}%
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    {onView && (
                                        <button
                                            onClick={() => onView(task.id)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onEdit && task.status !== 'approved' && (
                                        <button
                                            onClick={() => onEdit(task.id)}
                                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onSubmit && task.status === 'draft' && (
                                        <button
                                            onClick={() => onSubmit(task.id)}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                            title="Submit for Approval"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onDelete && task.status === 'draft' && (
                                        <button
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        'Are you sure you want to delete this task?'
                                                    )
                                                ) {
                                                    onDelete(task.id);
                                                }
                                            }}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

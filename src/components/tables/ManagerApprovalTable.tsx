'use client';

import React, { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    MessageSquare,
} from 'lucide-react';

interface ApprovalTask {
    id: number;
    taskId: number;
    employeeId: number;
    employeeName: string;
    taskTitle: string;
    taskDate: string | Date;
    taskDescription?: string;
    hours: number;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string | Date;
    completionPercentage: number;
}

interface ManagerApprovalTableProps {
    tasks: ApprovalTask[];
    onApprove?: (approvalId: number, taskId: number) => void;
    onReject?: (approvalId: number, taskId: number) => void;
    onView?: (taskId: number) => void;
    isLoading?: boolean;
}

export function ManagerApprovalTable({
    tasks,
    onApprove,
    onReject,
    onView,
    isLoading = false,
}: ManagerApprovalTableProps) {
    const [selectedTask, setSelectedTask] = useState<number | null>(null);
    const [approvalComments, setApprovalComments] = useState<string>('');
    const [rejectionReason, setRejectionReason] = useState<string>('');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const pendingTasks = tasks.filter((t) => t.status === 'pending');
    const completedTasks = tasks.filter((t) => t.status !== 'pending');

    if (pendingTasks.length === 0 && completedTasks.length === 0) {
        return (
            <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No tasks for review</p>
                <p className="text-sm text-gray-500">Team members haven't submitted any tasks yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Pending Approvals */}
            {pendingTasks.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Pending Approvals ({pendingTasks.length})
                    </h3>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                        <table className="w-full">
                            <thead className="bg-yellow-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Employee
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Task
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Hours
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Progress
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-yellow-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {task.employeeName}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {task.taskTitle}
                                            </p>
                                            {task.taskDescription && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {task.taskDescription.substring(0, 50)}...
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {new Date(task.taskDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {task.hours}h
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${task.completionPercentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-600">
                                                    {task.completionPercentage}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(task.taskId)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onApprove && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTask(task.id);
                                                            if (onApprove) onApprove(task.id, task.taskId);
                                                        }}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onReject && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTask(task.id);
                                                            // Could open modal for rejection reason
                                                            if (onReject) onReject(task.id, task.taskId);
                                                        }}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Completed Approvals */}
            {completedTasks.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Completed Reviews
                    </h3>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Employee
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Task
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Date Reviewed
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {completedTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {task.employeeName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {task.taskTitle}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${task.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {task.status === 'approved' ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                {task.status.charAt(0).toUpperCase() +
                                                    task.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {new Date(task.submittedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: '2-digit',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

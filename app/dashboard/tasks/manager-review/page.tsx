'use client';

import React, { useState, useEffect } from 'react';
import { ManagerApprovalTable } from '@/src/components/tables/ManagerApprovalTable';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApprovalTask {
    id: number;
    taskId: number;
    employeeId: number;
    employeeName: string;
    taskTitle: string;
    taskDate: Date;
    taskDescription?: string;
    hours: number;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    completionPercentage: number;
}

export default function ManagerTaskReviewPage() {
    const [tasks, setTasks] = useState<ApprovalTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock manager ID - replace with actual auth session
    const managerId = 2;

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/approvals?managerId=${managerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch approvals');
            }
            const data = await response.json();
            if (data.success && data.approvals) {
                // Map API response to component format
                const formattedTasks = data.approvals.map((approval: any) => ({
                    id: approval.id,
                    taskId: approval.taskId,
                    employeeId: approval.employeeId,
                    employeeName: approval.employeeName,
                    taskTitle: approval.taskTitle,
                    taskDate: new Date(approval.taskDate),
                    taskDescription: approval.taskDescription,
                    hours: approval.hours,
                    status: approval.approvalStatus,
                    submittedAt: new Date(approval.submittedAt),
                    completionPercentage: approval.completionPercentage,
                }));
                setTasks(formattedTasks);
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (approvalId: number, taskId: number) => {
        try {
            const response = await fetch(`/api/approvals/${approvalId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            if (!response.ok) throw new Error('Failed to approve');
            await loadTasks();
        } catch (error) {
            console.error('Failed to approve task:', error);
        }
    };

    const handleReject = async (approvalId: number, taskId: number) => {
        const reason = window.prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(`/api/approvals/${approvalId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rejectionReason: reason }),
            });
            if (!response.ok) throw new Error('Failed to reject');
            await loadTasks();
        } catch (error) {
            console.error('Failed to reject task:', error);
        }
    };

    const filteredTasks = tasks.filter((task) => task.status === 'pending'); const pendingCount = tasks.filter((t) => t.status === 'pending').length;
    const approvedCount = tasks.filter((t) => t.status === 'approved').length;
    const rejectedCount = tasks.filter((t) => t.status === 'rejected').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Task Review Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Review and approve team member task submissions
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Pending Review</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                        </div>
                        <Clock className="w-10 h-10 text-yellow-400 opacity-20" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Awaiting your action</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Approved</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-400 opacity-20" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">This week</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Rejected</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">{rejectedCount}</p>
                        </div>
                        <XCircle className="w-10 h-10 text-red-400 opacity-20" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Sent back for revision</p>
                </div>
            </div>

            {/* Tasks Table */}
            <div>
                <ManagerApprovalTable
                    tasks={tasks}
                    isLoading={isLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            </div>

            {/* Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Approval Checklist
                    </h3>
                    <ul className="text-sm text-green-800 mt-3 space-y-2">
                        <li>✓ Task description is clear and detailed</li>
                        <li>✓ Hours logged are reasonable</li>
                        <li>✓ Completion percentage is accurate</li>
                        <li>✓ Task aligns with project scope</li>
                        <li>✓ No duplicate entries</li>
                    </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Common Rejection Reasons
                    </h3>
                    <ul className="text-sm text-red-800 mt-3 space-y-2">
                        <li>✗ Insufficient task description</li>
                        <li>✗ Hours logged seem excessive</li>
                        <li>✗ Missing task details or category</li>
                        <li>✗ Task not aligned with project</li>
                        <li>✗ Duplicate task entry</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

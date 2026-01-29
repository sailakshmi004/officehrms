'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface TaskReport {
    employeeName: string;
    totalTasks: number;
    approvedTasks: number;
    rejectedTasks: number;
    pendingTasks: number;
    totalHours: number;
    approvalRate: number;
}

export default function TaskReportPage() {
    const [reports, setReports] = useState<TaskReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('week');

    useEffect(() => {
        loadReports();
    }, [dateRange]);

    const loadReports = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/reports?range=${dateRange}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }
            const data = await response.json();
            if (data.success && data.reports) {
                setReports(data.reports);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Task Reports</h1>
                    <p className="text-gray-600 mt-1">
                        Team productivity and task completion metrics
                    </p>
                </div>

                {/* Date Range Filter */}
                <div className="flex gap-2">
                    {['week', 'month', 'quarter'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === range
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {reports.reduce((sum, r) => sum + r.totalTasks, 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Submitted by team</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Approved Rate</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {reports.length > 0
                            ? Math.round(
                                (reports.reduce((sum, r) => sum + r.approvedTasks, 0) /
                                    reports.reduce((sum, r) => sum + r.totalTasks, 0)) *
                                100
                            )
                            : 0}
                        %
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Success rate</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Total Hours</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {reports.reduce((sum, r) => sum + r.totalHours, 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Logged by team</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-sm font-medium">Team Members</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{reports.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Active reporters</p>
                </div>
            </div>

            {/* Employee Summary Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Employee Task Summary
                    </h2>
                </div>

                {reports.length === 0 ? (
                    <div className="text-center p-8">
                        <p className="text-gray-600">No data available for this period</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Employee
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Total Tasks
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Approved
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Pending
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Rejected
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Approval Rate
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Total Hours
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reports.map((report, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {report.employeeName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {report.totalTasks}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {report.approvedTasks}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                {report.pendingTasks}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {report.rejectedTasks}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${report.approvalRate}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span>{Math.round(report.approvalRate)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {report.totalHours}h
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Top Performers
                    </h3>
                    <p className="text-sm text-blue-800 mt-2">
                        {reports.length > 0
                            ? `${reports[0]?.employeeName || 'N/A'} has the highest approval rate`
                            : 'No data yet'}
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900">Report Features</h3>
                    <ul className="text-sm text-purple-800 mt-2 space-y-1">
                        <li>• Tracks daily task submissions</li>
                        <li>• Monitors approval rates by employee</li>
                        <li>• Logs total hours worked</li>
                        <li>• Identifies trends and patterns</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

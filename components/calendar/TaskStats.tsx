"use client";

interface DayStats {
    draftTasks: number;
    pendingReview: number;
    approved: number;
    totalHours: number;
}

interface TaskStatsProps {
    stats: DayStats;
}

export function TaskStats({ stats }: TaskStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Draft Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.draftTasks}
                </p>
                <p className="text-gray-500 text-xs mt-2">Ready to submit</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-amber-500 mt-2">
                    {stats.pendingReview}
                </p>
                <p className="text-gray-500 text-xs mt-2">Awaiting approval</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                    {stats.approved}
                </p>
                <p className="text-gray-500 text-xs mt-2">This week</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Hours</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                    {stats.totalHours}
                </p>
                <p className="text-gray-500 text-xs mt-2">This week</p>
            </div>
        </div>
    );
}

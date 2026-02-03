"use client";

import { useState, useCallback, useEffect } from "react";
import { Calendar, List } from "lucide-react";
import { TaskCalendar } from "@/components/calendar/TaskCalendar";
import { AddTaskModal } from "@/components/calendar/AddTaskModal";
import { TaskStats } from "@/components/calendar/TaskStats";

interface Task {
    id: string;
    description: string;
    hoursSpent: string;
    submissionStatus: string;
    taskDate: string;
}

interface DayStats {
    draftTasks: number;
    pendingReview: number;
    approved: number;
    totalHours: number;
}

export default function TaskManagement() {
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
    const [stats, setStats] = useState<DayStats>({
        draftTasks: 2,
        pendingReview: 0,
        approved: 2,
        totalHours: 32,
    });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/daily-tasks");
                const result = await response.json();
                
                if (result.success && result.data) {
                    const formattedTasks = result.data.map((task: any) => ({
                        id: task.id,
                        description: task.description,
                        hoursSpent: task.hoursSpent?.toString() || "0",
                        submissionStatus: task.submissionStatus?.toLowerCase() || "draft",
                        taskDate: task.taskDate,
                    }));
                    setTasks(formattedTasks);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleAddTask = (date: string) => {
        setSelectedDate(date);
        setShowModal(true);
    };

    const handleTaskAdded = useCallback(() => {
        // Refresh tasks after adding a new one
        const fetchTasks = async () => {
            try {
                const response = await fetch("/api/daily-tasks");
                const result = await response.json();
                
                if (result.success && result.data) {
                    const formattedTasks = result.data.map((task: any) => ({
                        id: task.id,
                        description: task.description,
                        hoursSpent: task.hoursSpent?.toString() || "0",
                        submissionStatus: task.submissionStatus?.toLowerCase() || "draft",
                        taskDate: task.taskDate,
                    }));
                    setTasks(formattedTasks);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
        
        setStats((prev) => ({
            ...prev,
            draftTasks: prev.draftTasks + 1,
        }));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Tasks</h1>
                    <p className="text-gray-600">Manage and track your daily work updates</p>
                </div>

                {/* View Toggle */}
                <div className="flex justify-end gap-2 mb-6">
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${viewMode === "calendar"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-600 border border-gray-300"
                            }`}
                    >
                        <Calendar size={20} />
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${viewMode === "list"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-600 border border-gray-300"
                            }`}
                    >
                        <List size={20} />
                        List
                    </button>
                </div>

                {/* Stats Cards */}
                <TaskStats stats={stats} />

                {/* Calendar */}
                {viewMode === "calendar" && (
                    <>
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Loading calendar...</p>
                            </div>
                        ) : (
                            <TaskCalendar tasks={tasks} onAddTask={handleAddTask} />
                        )}
                    </>
                )}
            </div>

            {/* Add Task Modal */}
            <AddTaskModal
                isOpen={showModal}
                selectedDate={selectedDate}
                onClose={() => setShowModal(false)}
                onTaskAdded={handleTaskAdded}
            />
        </div>
    );
}

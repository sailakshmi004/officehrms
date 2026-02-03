"use client";

import { useState, useEffect } from "react";

interface Project {
    id: string;
    projectName: string;
}

interface AddTaskModalProps {
    isOpen: boolean;
    selectedDate: string | null;
    onClose: () => void;
    onTaskAdded?: () => void;
}

export function AddTaskModal({
    isOpen,
    selectedDate,
    onClose,
    onTaskAdded,
}: AddTaskModalProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        projectId: "",
        description: "",
        startTime: "",
        endTime: "",
        hoursSpent: "",
    });

    useEffect(() => {
        // Fetch projects when modal opens
        if (isOpen) {
            fetchProjects();
            setError(null);
            setSuccess(false);
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/projects", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data.data || []);
            } else {
                setError("Failed to load projects");
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            setError("Error loading projects");
        } finally {
            setLoading(false);
        }
    };

    const calculateHours = (start: string, end: string) => {
        if (!start || !end) return "";
        const startTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);
        const hours =
            (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        return hours > 0 ? hours.toFixed(2) : "";
    };

    const handleTimeChange = (field: string, value: string) => {
        const newData = { ...formData, [field]: value };

        if (field === "startTime" || field === "endTime") {
            const hours = calculateHours(newData.startTime, newData.endTime);
            newData.hoursSpent = hours;
        }

        setFormData(newData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.projectId ||
            !formData.description ||
            !formData.startTime ||
            !formData.endTime ||
            !formData.hoursSpent
        ) {
            setError("Please fill all fields");
            return;
        }

        if (!selectedDate) {
            setError("Please select a date");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            // Get empId from localStorage or use a default
            const empId = localStorage.getItem("empId") || "default-emp-id";
            const approverId = localStorage.getItem("approverId") || empId;

            const response = await fetch("/api/daily-tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    empId,
                    approverId,
                    projectId: formData.projectId,
                    taskDate: selectedDate,
                    description: formData.description,
                    hoursSpent: parseFloat(formData.hoursSpent),
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    projectId: "",
                    description: "",
                    startTime: "",
                    endTime: "",
                    hoursSpent: "",
                });

                // Call the callback to refresh task list
                if (onTaskAdded) {
                    onTaskAdded();
                }

                // Close modal after 1 second
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 1000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create task");
            }
        } catch (error) {
            console.error("Error creating task:", error);
            setError("Error creating task");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Task</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                        Task created successfully!
                    </div>
                )}

                {loading && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
                        Loading projects...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project *
                        </label>
                        <select
                            value={formData.projectId}
                            onChange={(e) =>
                                setFormData({ ...formData, projectId: e.target.value })
                            }
                            disabled={loading || submitting}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                        >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.projectName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            disabled={submitting}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            rows={3}
                            placeholder="Describe your task..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleTimeChange("startTime", e.target.value)}
                                disabled={submitting}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time *
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleTimeChange("endTime", e.target.value)}
                                disabled={submitting}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Hours Spent *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.hoursSpent}
                            onChange={(e) =>
                                setFormData({ ...formData, hoursSpent: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            placeholder="0.00"
                            readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Auto-calculated from start and end times
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-400"
                        >
                            {submitting ? "Creating..." : "Add Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


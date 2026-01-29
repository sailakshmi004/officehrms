'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Calendar, Clock, FileText, Zap } from 'lucide-react';

interface TaskModalProps {
    date: Date | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: TaskData) => void;
    existingTasks?: Task[];
}

interface Task {
    id: number;
    title: string;
    description?: string;
    hours: number;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    completionPercentage: number;
    status: string;
}

interface TaskData {
    title: string;
    description: string;
    hours: number;
    priority: 'low' | 'medium' | 'high';
    category: string;
    completionPercentage: number;
}

export function TaskModal({
    date,
    isOpen,
    onClose,
    onSubmit,
    existingTasks = [],
}: TaskModalProps) {
    const [formData, setFormData] = useState<TaskData>({
        title: '',
        description: '',
        hours: 8,
        priority: 'medium',
        category: '',
        completionPercentage: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                title: '',
                description: '',
                hours: 8,
                priority: 'medium',
                category: '',
                completionPercentage: 0,
            });
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.title.length > 255) {
            newErrors.title = 'Title must be less than 255 characters';
        }

        if (formData.hours < 0 || formData.hours > 24) {
            newErrors.hours = 'Hours must be between 0 and 24';
        }

        if (formData.completionPercentage < 0 || formData.completionPercentage > 100) {
            newErrors.completionPercentage = 'Completion percentage must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            onSubmit(formData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !date) {
        return null;
    }

    const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Add Task</h2>
                            <p className="text-sm text-gray-600">{dateStr}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Existing Tasks for this Date */}
                    {existingTasks.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-900 mb-3">
                                Existing tasks for this date:
                            </p>
                            <div className="space-y-2">
                                {existingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="bg-white p-3 rounded border border-blue-100 text-sm"
                                    >
                                        <p className="font-medium text-gray-900">{task.title}</p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            {task.hours}h • {task.priority}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-blue-800 mt-3">
                                You can add more tasks for this date below
                            </p>
                        </div>
                    )}

                    {/* Title Field */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Implemented user authentication"
                            maxLength={255}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.title}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.title.length}/255 characters
                        </p>
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Description
                            </div>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide details about what you accomplished..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Two Column Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Hours Field */}
                        <div>
                            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Hours Spent
                                </div>
                            </label>
                            <input
                                type="number"
                                id="hours"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                min="0"
                                max="24"
                                step="0.5"
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.hours ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.hours && (
                                <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
                            )}
                        </div>

                        {/* Priority Field */}
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Priority
                                </div>
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Field */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category / Project
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g., Project Alpha, Maintenance"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Completion Percentage */}
                    <div>
                        <label htmlFor="completionPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                            Completion % ({formData.completionPercentage}%)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                id="completionPercentage"
                                name="completionPercentage"
                                value={formData.completionPercentage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="5"
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <input
                                type="number"
                                value={formData.completionPercentage}
                                onChange={handleChange}
                                name="completionPercentage"
                                min="0"
                                max="100"
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                            />
                        </div>
                        {errors.completionPercentage && (
                            <p className="text-red-500 text-sm mt-1">{errors.completionPercentage}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Task'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

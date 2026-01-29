'use client';

import React, { useState } from 'react';
import { AlertCircle, Calendar, Clock, FileText, Zap } from 'lucide-react';

interface TaskFormProps {
    employeeId: number;
    onSubmit?: (data: TaskFormData) => void;
    initialData?: Partial<TaskFormData>;
    isEditing?: boolean;
}

export interface TaskFormData {
    taskDate: Date;
    title: string;
    description: string;
    hours: number;
    priority: 'low' | 'medium' | 'high';
    category: string;
    completionPercentage: number;
}

export function TaskForm({
    employeeId,
    onSubmit,
    initialData,
    isEditing = false,
}: TaskFormProps) {
    const [formData, setFormData] = useState<TaskFormData>({
        taskDate: new Date(),
        title: '',
        description: '',
        hours: 8,
        priority: 'medium',
        category: '',
        completionPercentage: 0,
        ...initialData,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate valid date range (past week + current week)
    const getValidDateRange = () => {
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay());

        const pastWeekStart = new Date(currentWeekStart);
        pastWeekStart.setDate(currentWeekStart.getDate() - 7);

        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (6 - today.getDay()));

        return { start: pastWeekStart, end: weekEnd };
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const { start, end } = getValidDateRange();

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.title.length > 255) {
            newErrors.title = 'Title must be less than 255 characters';
        }

        if (formData.taskDate < start || formData.taskDate > end) {
            newErrors.taskDate =
                'Task date must be within past week and current week';
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

        if (type === 'date') {
            setFormData((prev) => ({
                ...prev,
                [name]: new Date(value),
            }));
        } else if (type === 'number') {
            setFormData((prev) => ({
                ...prev,
                [name]: parseFloat(value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error for this field
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
            if (onSubmit) {
                onSubmit(formData);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const { start: minDate, end: maxDate } = getValidDateRange();
    const dateString = formData.taskDate.toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Date Field */}
            <div>
                <label htmlFor="taskDate" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Task Date
                    </div>
                </label>
                <input
                    type="date"
                    id="taskDate"
                    name="taskDate"
                    value={dateString}
                    onChange={handleChange}
                    min={minDate.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.taskDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.taskDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.taskDate}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    Valid range: Past week to current week (Sunday-Saturday)
                </p>
            </div>

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
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.hours ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.hours && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.hours}
                        </p>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            {/* Category & Completion Percentage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Completion Percentage */}
                <div>
                    <label htmlFor="completionPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                        Completion % ({formData.completionPercentage}%)
                    </label>
                    <div className="flex items-center gap-2">
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
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                    </div>
                    {errors.completionPercentage && (
                        <p className="text-red-500 text-sm mt-1">{errors.completionPercentage}</p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Save Task'}
                </button>
                <button
                    type="button"
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => {
                        setFormData({
                            taskDate: new Date(),
                            title: '',
                            description: '',
                            hours: 8,
                            priority: 'medium',
                            category: '',
                            completionPercentage: 0,
                        });
                    }}
                >
                    Clear
                </button>
            </div>
        </form>
    );
}

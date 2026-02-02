import EmployeeForm from "@/components/forms/EmployeeForm";

export default function AddEmployeePage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Employee Management</h1>
                <EmployeeForm />
            </div>
        </div>
    );
}

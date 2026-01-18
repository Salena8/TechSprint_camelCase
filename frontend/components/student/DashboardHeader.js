import { Button } from "@/components/ui";

export default function StudentDashboardHeader({ classCode = "SN-K46FCR", studentName = "Student" }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, <span className="font-medium">{studentName}</span>
        </p>
        <p className="text-sm text-gray-500">
          Classroom Code: <span className="font-medium">{classCode}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary">My Progress</Button>
        <Button variant="secondary">Help</Button>
        <Button variant="danger">Leave Class</Button>
      </div>
    </div>
  );
}
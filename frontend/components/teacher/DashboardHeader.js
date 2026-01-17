import { Button } from "@/components/ui";

export default function DashboardHeader({ classCode = "SN-K46FCR" }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <p className="text-sm text-gray-500">
          Classroom Code: <span className="font-medium">{classCode}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary">Attendance</Button>
        <Button variant="secondary">Leaderboard</Button>
        <Button variant="danger">End Class</Button>
      </div>
    </div>
  );
}

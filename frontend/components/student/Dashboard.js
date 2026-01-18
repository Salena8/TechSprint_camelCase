import { StudentDashboardHeader, StudentClassroom, StudentLeaderboard } from "./index";

export default function StudentDashboard({ classCode, studentName }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <StudentDashboardHeader classCode={classCode} studentName={studentName} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Classroom Content */}
          <div className="lg:col-span-2">
            <StudentClassroom classCode={classCode} studentName={studentName} />
          </div>

          {/* Sidebar with Leaderboard */}
          <div className="lg:col-span-1">
            <StudentLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
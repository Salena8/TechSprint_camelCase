import { useRouter } from "next/router";

import DashboardHeader from "@/components/teacher/DashboardHeader";
import LiveLessonControl from "@/components/teacher/LiveLessonControl";
import LessonUpload from "@/components/teacher/LessonUpload";
import ClassActivity from "@/components/teacher/ClassActivity";
import OfflineAIHelper from "@/components/teacher/OfflineAIHelper";
import AssessmentPanel from "@/components/teacher/AssessmentPanel";

export default function TeacherClassDashboard() {
  const router = useRouter();
  const { code } = router.query; // ← THIS is the classroom code

  if (!code) return null; // prevents hydration issues

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <DashboardHeader classCode={code} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LiveLessonControl />

        <div className="space-y-6 lg:col-span-2">
          <LessonUpload />
          <AssessmentPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ClassActivity />
        <OfflineAIHelper />
      </div>
    </div>
  );
}


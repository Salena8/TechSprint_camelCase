import { BookOpen, User, Users } from "lucide-react";
import { Button, Card, IconBox } from "../components/ui";
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center space-y-10">

        {/* App Title */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <IconBox color="purple">
              <BookOpen size={28} />
            </IconBox>
          </div>

          <h1 className="text-4xl font-bold text-gray-800">
            ShikshaNode
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            An offline-first classroom learning system designed for
            rural schools with limited or no internet access.
          </p>
        </div>

        {/* Teacher / Student Blocks */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Teacher */}
          <Card>
            <div className="flex flex-col items-center space-y-4">
              <IconBox color="green">
                <User size={26} />
              </IconBox>

              <h2 className="text-xl font-semibold">
                Teacher Mode
              </h2>

              <p className="text-gray-600 text-sm">
                Create classrooms, broadcast slides, manage quizzes,
                track attendance — all offline.
              </p>

              <Button variant="primary"
                onClick={() => router.push('/teacher/create-class')}>
                Create Classroom
              </Button>
            </div>
          </Card>

          {/* Student */}
          <Card>
            <div className="flex flex-col items-center space-y-4">
              <IconBox color="pink">
                <Users size={26} />
              </IconBox>

              <h2 className="text-xl font-semibold">
                Student Mode
              </h2>

              <p className="text-gray-600 text-sm">
                Join class, follow lessons, answer quizzes,
                earn points and badges.
              </p>

              <Button variant="secondary"
                onClick={() => router.push('/student')}>
                Join Classroom
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </main>
  );
}

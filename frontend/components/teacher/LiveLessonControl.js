import { Card, Button } from "@/components/ui";

export default function LiveLessonControl() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Live Lesson Control</h3>

      <div className="bg-blue-50 rounded-lg p-4 text-center mb-4">
        <p className="text-sm text-gray-500">Current Slide</p>
        <p className="text-4xl font-bold">1</p>
        <p className="text-xs text-gray-400">of 24 slides</p>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary">Previous</Button>
        <Button variant="primary">Next</Button>
      </div>

      <p className="text-xs text-green-600 mt-3 text-center">
        All students synced
      </p>
    </Card>
  );
}

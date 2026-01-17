import { Card, Button } from "@/components/ui";

export default function LessonUpload() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Upload Lesson Pack</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Button variant="outline">Slides</Button>
        <Button variant="outline">PDF</Button>
        <Button variant="outline">Video</Button>
        <Button variant="outline">Notes</Button>
      </div>

      <div className="border rounded-lg p-3 text-sm text-gray-600">
        <p>📄 Introduction_to_Physics.pdf</p>
        <p>🎥 Motion_Lecture.mp4</p>
        <p>📝 Chapter_Notes.txt</p>
      </div>
    </Card>
  );
}

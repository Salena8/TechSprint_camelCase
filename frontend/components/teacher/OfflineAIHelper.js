import { Card, Button } from "@/components/ui";

export default function OfflineAIHelper() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Offline AI Helper</h3>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary">
          Generate Quiz Questions
        </Button>

        <Button variant="secondary">
          Summarize Lesson
        </Button>
      </div>
    </Card>
  );
}

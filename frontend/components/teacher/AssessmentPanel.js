import { Card, Button } from "@/components/ui";

export default function AssessmentPanel() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Start Assessment</h3>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Start Quiz</Button>
        <Button variant="success">Start Poll</Button>
        <Button variant="warning">Assign Homework</Button>
      </div>
    </Card>
  );
}
import { Card } from "@/components/ui";

export default function ClassActivity() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Class Activity</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Connected Students</span>
          <span className="font-medium">28</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Live Engagement</span>
          <span className="text-green-600 font-medium">High</span>
        </div>

        
      </div>
    </Card>
  );
}

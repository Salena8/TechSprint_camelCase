import { Card } from "@/components/ui";

export default function StudentLeaderboard() {
  // Sample leaderboard data (would come from backend)
  const leaderboardData = [
    { name: "Alice Johnson", points: 245, rank: 1, isCurrentUser: false },
    { name: "Bob Smith", points: 238, rank: 2, isCurrentUser: false },
    { name: "Charlie Brown", points: 232, rank: 3, isCurrentUser: false },
    { name: "Diana Wilson", points: 198, rank: 4, isCurrentUser: true },
    { name: "Eve Davis", points: 187, rank: 5, isCurrentUser: false },
    { name: "Frank Miller", points: 175, rank: 6, isCurrentUser: false },
    { name: "Grace Lee", points: 162, rank: 7, isCurrentUser: false },
    { name: "Henry Taylor", points: 148, rank: 8, isCurrentUser: false },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 bg-yellow-50";
      case 2:
        return "text-gray-600 bg-gray-50";
      case 3:
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-white";
    }
  };

  return (
    <Card>
      <h3 className="font-semibold mb-6">Leaderboard</h3>

      <div className="space-y-3">
        {/* Top 3 Performers - Special Layout */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {leaderboardData.slice(0, 3).map((student) => (
            <div
              key={student.rank}
              className={`text-center p-4 rounded-lg border-2 ${getRankColor(student.rank)}`}
            >
              <div className="text-2xl mb-2">{getRankIcon(student.rank)}</div>
              <div className="font-semibold text-sm mb-1">{student.name}</div>
              <div className="text-lg font-bold text-green-600">{student.points}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          ))}
        </div>

        {/* Other Students List */}
        <div className="space-y-2">
          {leaderboardData.slice(3).map((student) => (
            <div
              key={student.rank}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                student.isCurrentUser
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  student.isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {student.rank}
                </div>
                <div>
                  <p className={`font-medium text-sm ${
                    student.isCurrentUser ? "text-blue-700" : ""
                  }`}>
                    {student.name}
                    {student.isCurrentUser && (
                      <span className="ml-2 text-xs text-blue-600">(You)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-600">{student.points}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Rankings update in real-time during quizzes
        </p>
      </div>
    </Card>
  );
}
// components/Leaderboard.js
export default function Leaderboard({ scores, maxItems = 10 }) {
   
    const transformScores = (scoresObj) => {
        if (!scoresObj || typeof scoresObj !== 'object') {
            // Default data for demo
            return [
                { id: "ps", name: "Priya", points: 890 },
                { id: "rk", name: "Rahul", points: 845 },
                { id: "as", name: "Ananya", points: 820 },
                { id: "ap", name: "Arjun", points: 750 },
                { id: "sr", name: "Sneha", points: 720 },
                { id: "vg", name: "Vikram", points: 680 },
                { id: "kd", name: "Kavya", points: 650 },
                { id: "am", name: "Aditya", points: 620 },
                { id: "dn", name: "Divya", points: 580 },
                { id: "rj", name: "Rohan", points: 550 },
            ];
        }

        return Object.entries(scoresObj)
            .map(([id, points]) => ({
                id,
                name: id === 'current' ? 'You' : `Student ${id.slice(0, 4)}`,
                points: points || 0
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, maxItems);
    };

    const leaderboardData = transformScores(scores);
    const top3 = leaderboardData.slice(0, 3);
    const rest = leaderboardData.slice(3);

    const getRankIcon = (rank) => {
        switch(rank) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return rank;
        }
    };

    const getRankColor = (rank) => {
        switch(rank) {
            case 1: return "bg-gradient-to-br from-yellow-400 to-orange-500";
            case 2: return "bg-gradient-to-br from-gray-300 to-gray-400";
            case 3: return "bg-gradient-to-br from-amber-600 to-amber-700";
            default: return "bg-gray-100";
        }
    };

    return (
        <div className="space-y-4">
            {/* Top 3 Podium */}
            {top3.length >= 3 && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h5 className="font-bold text-gray-800 mb-4 text-center">Top Performers</h5>
                    <div className="grid grid-cols-3 gap-3 items-end">
                        {/* 2nd Place */}
                        <div className="order-1">
                            <div className={`${getRankColor(2)} text-white p-3 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform`}>
                                <div className="text-2xl mb-1">{getRankIcon(2)}</div>
                                <div className="font-bold text-sm truncate" title={top3[1]?.name}>
                                    {top3[1]?.name}
                                </div>
                                <div className="text-xs opacity-90">{top3[1]?.points} pts</div>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div className="order-2">
                            <div className={`${getRankColor(1)} text-white p-4 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform`}>
                                <div className="text-3xl mb-1">{getRankIcon(1)}</div>
                                <div className="font-bold text-sm truncate" title={top3[0]?.name}>
                                    {top3[0]?.name}
                                </div>
                                <div className="text-sm opacity-90">{top3[0]?.points} pts</div>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="order-3">
                            <div className={`${getRankColor(3)} text-white p-3 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform`}>
                                <div className="text-2xl mb-1">{getRankIcon(3)}</div>
                                <div className="font-bold text-sm truncate" title={top3[2]?.name}>
                                    {top3[2]?.name}
                                </div>
                                <div className="text-xs opacity-90">{top3[2]?.points} pts</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Rankings */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <h5 className="font-bold text-gray-800 mb-4">All Rankings</h5>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {leaderboardData.map((player, index) => (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                index < 3 ? 'bg-gradient-to-r from-gray-50 to-white border-l-4 border-yellow-400' : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    index === 0 ? 'bg-yellow-400 text-white' :
                                    index === 1 ? 'bg-gray-400 text-white' :
                                    index === 2 ? 'bg-amber-600 text-white' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {index < 3 ? getRankIcon(index + 1) : index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-medium text-gray-800 truncate" title={player.name}>
                                        {player.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Rank {index + 1}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm font-bold text-blue-600 ml-2">
                                {player.points} pts
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
  
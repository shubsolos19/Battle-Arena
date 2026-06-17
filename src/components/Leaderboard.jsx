import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { OPENROUTER_MODELS, HUGGINGFACE_MODELS } from '../constants/models';
import { RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'text', label: 'Text' },
  { id: 'poem', label: 'Poem' },
  { id: 'roast', label: 'Roast' },
  { id: 'story', label: 'Story' },
  { id: 'summary', label: 'Summary' },
];

export default function Leaderboard({ onBack }) {
  const [category, setCategory] = useState('all');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/leaderboard?category=${category}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${res.status}`);
        }
        const json = await res.json();
        
        // Map raw model_ids to human-readable names
        const allModels = [...OPENROUTER_MODELS, ...HUGGINGFACE_MODELS];
        const enrichedData = json.map((item, index) => {
          const modelDef = allModels.find(m => m.id === item.model_id);
          return {
            ...item,
            rank: index + 1,
            modelName: modelDef ? modelDef.name : item.model_id,
            winRateFormatted: item.win_rate.toFixed(1) + '%',
          };
        });
        
        setData(enrichedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [category]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl text-sm">
          <p className="font-bold text-zinc-100 mb-1">{data.modelName}</p>
          <p className="text-zinc-400">Win Rate: <span className="text-purple-400 font-medium">{data.winRateFormatted}</span></p>
          <p className="text-zinc-400">Total Battles: <span className="text-zinc-200">{data.total}</span></p>
          <p className="text-zinc-400">Wins: <span className="text-zinc-200">{data.wins}</span></p>
        </div>
      );
    }
    return null;
  };

  const CustomBarLabel = (props) => {
    const { x, y, width, height, value, index, payload } = props;
    if (width < 50) return null; // Don't show label if bar is too short
    return (
      <text 
        x={x + width - 10} 
        y={y + height / 2} 
        fill="#ffffff" 
        textAnchor="end" 
        dominantBaseline="middle"
        className="text-[10px] sm:text-xs font-medium"
      >
        {value.toFixed(1)}% ({payload.total} votes)
      </text>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8 text-zinc-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <button 
            onClick={onBack}
            className="text-zinc-500 hover:text-white transition-colors text-sm mb-4 flex items-center gap-2"
          >
            ← Back to Arena
          </button>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Model Leaderboard</h2>
          <p className="text-zinc-400">Ranked by win rate across all Modelfight battles</p>
        </div>

        <div className="w-full sm:w-auto">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-48 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 outline-none transition-colors"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
          <p>Loading rankings...</p>
        </div>
      ) : error ? (
        <div className="w-full flex flex-col items-center justify-center py-20 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
          <p>Error loading leaderboard: {error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <p className="text-lg text-zinc-300 mb-4">No battles recorded yet.</p>
          <p className="text-zinc-500 mb-6">Be the first to vote and put a model on the board!</p>
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            Start a Battle
          </button>
        </div>
      ) : (
        <>
          {/* Chart Section */}
          <div className="w-full h-[400px] bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="topGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#27272a" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  stroke="#71717a" 
                  fontSize={12}
                  tickFormatter={(val) => `${val}%`}
                />
                <YAxis 
                  dataKey="modelName" 
                  type="category" 
                  width={150} 
                  stroke="#71717a" 
                  fontSize={12}
                  tick={{ fill: '#a1a1aa' }}
                />
                <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="win_rate" 
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index < 3 ? "url(#topGradient)" : "#52525b"} 
                    />
                  ))}
                  <CustomBarLabel />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table Section */}
          <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/30">
            <table className="w-full text-sm text-left text-zinc-400">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-4">Rank</th>
                  <th scope="col" className="px-6 py-4">Model</th>
                  <th scope="col" className="px-6 py-4">Provider</th>
                  <th scope="col" className="px-6 py-4 text-center">Wins</th>
                  <th scope="col" className="px-6 py-4 text-center">Total</th>
                  <th scope="col" className="px-6 py-4 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.model_id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {item.rank <= 3 ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold">
                          #{item.rank}
                        </span>
                      ) : (
                        `#${item.rank}`
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-200">{item.modelName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-zinc-800 rounded-md text-[11px] font-mono border border-zinc-700">
                        {item.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-zinc-300">{item.wins}</td>
                    <td className="px-6 py-4 text-center text-zinc-300">{item.total}</td>
                    <td className="px-6 py-4 text-right text-white font-medium">{item.winRateFormatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

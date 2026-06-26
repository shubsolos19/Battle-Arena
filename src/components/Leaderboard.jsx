import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { OPENROUTER_MODELS, HUGGINGFACE_MODELS } from '../constants/models';
import { RefreshCw, ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'text', label: 'Text' },
  { id: 'poem', label: 'Poem' },
  { id: 'roast', label: 'Roast' },
  { id: 'story', label: 'Story' },
  { id: 'summary', label: 'Summary' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="glass-panel p-4 text-sm z-50">
        <p className="font-bold text-white mb-2">{d.modelName}</p>
        <div className="space-y-1">
          <p className="text-white/70">Win Rate: <span className="text-sky-400 font-medium">{d.winRateFormatted}</span></p>
          <p className="text-white/70">Total Battles: <span className="text-white">{d.total}</span></p>
          <p className="text-white/70">Wins: <span className="text-white">{d.wins}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const renderBarLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (!height || height < 20) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      fill="#ffffff"
      textAnchor="middle"
      fontSize={10}
      fontWeight={600}
      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
    >
      {typeof value === 'number' ? value.toFixed(0) + '%' : ''}
    </text>
  );
};

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

        const allModels = [...OPENROUTER_MODELS, ...HUGGINGFACE_MODELS];
        const enrichedData = (Array.isArray(json) ? json : []).map((item, index) => {
          const modelDef = allModels.find(m => m.id === item.model_id);
          return {
            ...item,
            rank: index + 1,
            modelName: modelDef ? modelDef.name : item.model_id,
            winRateFormatted: typeof item.win_rate === 'number' ? item.win_rate.toFixed(1) + '%' : '0%',
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col w-full max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 py-8 relative z-10"
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-6 text-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
              Model Leaderboard
            </h2>
          </div>
          <p className="text-white/60 text-sm mt-1">Ranked by win rate across all battles</p>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-32 text-white/50 gap-4 glass-panel rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="font-medium tracking-wide">Crunching the rankings...</p>
        </div>
      ) : error ? (
        <div className="w-full flex flex-col items-center justify-center py-20 text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20 backdrop-blur-md">
          <p className="font-medium">Error loading leaderboard: {error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-32 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="bg-sky-500/20 p-4 rounded-full mb-6 border border-sky-500/30">
            <Trophy className="w-10 h-10 text-sky-300" />
          </div>
          <p className="text-xl text-white mb-2 font-bold">No battles recorded yet.</p>
          <p className="text-white/50 mb-8">Be the first to vote and put a model on the board!</p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-sky-500/20 hover:bg-sky-500/40 border border-sky-500/50 text-sky-100 rounded-xl transition-all font-semibold shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
          >
            Start a Battle
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Table Section */}
          <div className="w-full lg:w-[60%] overflow-hidden rounded-2xl glass-panel">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white/70">
                <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-white/50 font-semibold tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-5">Rank</th>
                    <th scope="col" className="px-6 py-5">Model</th>
                    <th scope="col" className="px-6 py-5">Provider</th>
                    <th scope="col" className="px-6 py-5 text-center">Wins</th>
                    <th scope="col" className="px-6 py-5 text-center">Total</th>
                    <th scope="col" className="px-6 py-5 text-right">Win Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((item) => (
                    <tr key={item.model_id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-white">
                        {item.rank <= 3 ? (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 text-lg">
                            #{item.rank}
                          </span>
                        ) : (
                          <span className="text-white/40">#{item.rank}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white group-hover:text-sky-300 transition-colors">{item.modelName}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 bg-white/5 rounded-full text-[11px] font-mono border border-white/10 text-white/60 tracking-wide uppercase">
                          {item.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">{item.wins}</td>
                      <td className="px-6 py-4 text-center">{item.total}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${item.rank <= 3 ? 'text-sky-400' : 'text-white'}`}>
                          {item.winRateFormatted}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Section */}
          <div className="w-full lg:w-[40%] glass-panel rounded-2xl p-6 sm:p-8 pt-16 sm:pt-16 relative overflow-hidden" style={{ height: 500 }}>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
            
            {/* Category Dropdown */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-6 w-40 group z-20">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 block px-3 py-2 outline-none transition-all appearance-none cursor-pointer backdrop-blur-md shadow-inner"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">{cat.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white/50 group-hover:text-white/80 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 10, left: -20, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="modelName"
                  type="category"
                  stroke="rgba(255,255,255,0.2)"
                  fontSize={10}
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="rgba(255,255,255,0.2)"
                  fontSize={10}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                <Bar
                  dataKey="win_rate"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                  label={renderBarLabel}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="url(#premiumGradient)"
                      fillOpacity={Math.max(0.1, (entry.win_rate / 100))}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  );
}

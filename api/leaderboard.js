import { Redis } from '@upstash/redis'
import { createClient } from '@supabase/supabase-js'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const category = req.query.category || 'all'
  const cacheKey = `leaderboard:${category}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return res.status(200).json(cached)
  }

  let query = supabase.from('votes').select('*')
  if (category !== 'all') {
    query = query.eq('category', category)
  }
  const { data: votes, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  if (!votes || votes.length === 0) return res.status(200).json([])

  // Aggregate: for each model_id, count appearances and wins
  // tie/both_bad votes count toward total but NOT as wins for either model
  const stats = {}
  for (const vote of votes) {
    for (const side of ['a', 'b']) {
      const modelId = vote[`model_${side}_id`]
      const provider = vote[`model_${side}_provider`]
      if (!stats[modelId]) {
        stats[modelId] = { model_id: modelId, provider, wins: 0, total: 0 }
      }
      stats[modelId].total += 1
      if (vote.winner === side) {
        stats[modelId].wins += 1
      }
    }
  }

  const rankings = Object.values(stats)
    .map(s => ({ ...s, win_rate: s.total > 0 ? (s.wins / s.total) * 100 : 0 }))
    .sort((a, b) => b.win_rate - a.win_rate)

  await redis.set(cacheKey, rankings, { ex: 300 }) // 5 min TTL
  return res.status(200).json(rankings)
}

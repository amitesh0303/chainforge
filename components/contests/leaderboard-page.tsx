'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const LEADERBOARD = [
  { rank: 1, username: 'soliditymaster', elo: 2150, xp: 42000, badge: '🥇', wins: 12 },
  { rank: 2, username: 'web3dev_eth', elo: 2080, xp: 38000, badge: '🥈', wins: 10 },
  { rank: 3, username: 'rustacean99', elo: 1990, xp: 35000, badge: '🥉', wins: 8 },
  { rank: 4, username: 'defi_builder', elo: 1850, xp: 28000, badge: null, wins: 6 },
  { rank: 5, username: 'move_dev', elo: 1720, xp: 22000, badge: null, wins: 4 },
  { rank: 6, username: 'you', elo: 1340, xp: 2450, badge: null, wins: 0 },
];

export function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center gap-2 font-bold text-xl">
        <span>⚒️</span>
        <span className="text-white">ChainForge</span>
        <span className="text-blue-400">Academy</span>
        <span className="text-slate-600 font-normal ml-2">/ Leaderboard</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">🏆 Global Leaderboard</h1>
          <p className="text-slate-400 mb-8">Compete for the top spot in the blockchain dev community</p>

          <Tabs defaultValue="global">
            <TabsList className="bg-slate-800/50 mb-6">
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="evm">EVM</TabsTrigger>
              <TabsTrigger value="solana">Solana</TabsTrigger>
            </TabsList>
            <TabsContent value="global">
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800/50">
                    {LEADERBOARD.map((entry, i) => (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 ${
                          entry.username === 'you' ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="w-10 text-center">
                          {entry.badge ? (
                            <span className="text-2xl">{entry.badge}</span>
                          ) : (
                            <span className="text-slate-500 font-bold">#{entry.rank}</span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {entry.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {entry.username}
                            {entry.username === 'you' && <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">You</Badge>}
                          </div>
                          <div className="text-slate-400 text-sm">{entry.wins} contest wins</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{entry.elo.toLocaleString()}</div>
                          <div className="text-slate-400 text-xs">Elo</div>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <div className="font-bold text-yellow-400">{entry.xp.toLocaleString()}</div>
                          <div className="text-slate-400 text-xs">XP</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {['weekly', 'evm', 'solana'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card className="bg-slate-900/80 border-slate-700/50">
                  <CardContent className="py-12 text-center text-slate-400">
                    <p className="text-lg">🚀 {tab.charAt(0).toUpperCase() + tab.slice(1)} rankings coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

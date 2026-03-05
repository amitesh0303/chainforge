'use client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const BADGES = [
  { type: 'first_solve', label: 'First Blood', icon: '🩸', description: 'Solved your first problem', earned: true },
  { type: 'streak_7', label: '7-Day Streak', icon: '🔥', description: '7 consecutive days', earned: true },
  { type: 'evm_master', label: 'EVM Master', icon: '⚙️', description: 'Solved 20 EVM problems', earned: false },
  { type: 'solana_master', label: 'Solana Sage', icon: '☀️', description: 'Solved 20 Solana problems', earned: false },
  { type: 'contest_winner', label: 'Contest Winner', icon: '🏆', description: 'Won a contest', earned: false },
  { type: 'streak_30', label: '30-Day Legend', icon: '⚡', description: '30 consecutive days', earned: false },
];

const RECENT_SUBMISSIONS = [
  { problem: 'Vulnerable Lottery Fix', status: 'accepted', xp: 150, time: '2h ago' },
  { problem: 'Simple Staking', status: 'accepted', xp: 100, time: '1d ago' },
  { problem: 'Gas Optimized ERC20', status: 'wrong_answer', xp: 0, time: '2d ago' },
];

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center gap-2 font-bold text-xl">
        <span>⚒️</span>
        <span>ChainForge</span>
        <span className="text-blue-400">Academy</span>
        <span className="text-slate-600 font-normal ml-2">/ Profile</span>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-6 mb-8"
        >
          <Avatar className="w-20 h-20 border-2 border-blue-500/50">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user?.name ?? 'Anonymous Forger'}</h1>
            <p className="text-slate-400 mb-3">{user?.email}</p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">📊 Elo: 1,340</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⚡ 2,450 XP</Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">🔥 5-day streak</Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ 12 solved</Badge>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="badges">
          <TabsList className="bg-slate-800/50 mb-6">
            <TabsTrigger value="badges">Badges & NFTs</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="badges">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BADGES.map((badge, i) => (
                <motion.div
                  key={badge.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: badge.earned ? 1 : 0.4, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`bg-slate-900/80 border-slate-700/50 ${badge.earned ? 'border-yellow-500/30' : ''}`}>
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <div className="font-bold text-white">{badge.label}</div>
                      <div className="text-slate-400 text-sm mt-1">{badge.description}</div>
                      {badge.earned ? (
                        <Badge className="mt-3 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Earned ✓</Badge>
                      ) : (
                        <Badge className="mt-3 bg-slate-700/50 text-slate-500 border-slate-700 text-xs">Locked 🔒</Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800/50">
                  {RECENT_SUBMISSIONS.map((sub, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4"
                    >
                      <span className={`text-lg ${sub.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                        {sub.status === 'accepted' ? '✅' : '❌'}
                      </span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{sub.problem}</div>
                        <div className="text-slate-400 text-sm">{sub.time}</div>
                      </div>
                      {sub.xp > 0 && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          +{sub.xp} XP
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-base">Problems by Difficulty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Easy', count: 8, total: 20, color: 'bg-green-500' },
                    { label: 'Medium', count: 3, total: 20, color: 'bg-yellow-500' },
                    { label: 'Hard', count: 1, total: 10, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white">{item.count}/{item.total}</span>
                      </div>
                      <Progress value={(item.count / item.total) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-base">Chain Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: '⚙️ EVM', count: 10 },
                    { label: '☀️ Solana', count: 2 },
                    { label: '🔷 Move', count: 0 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white">{item.count} solved</span>
                      </div>
                      <Progress value={(item.count / 12) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

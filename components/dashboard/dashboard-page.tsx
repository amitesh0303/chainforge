'use client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Problems Solved', value: '12', icon: '✅', color: 'text-green-400' },
    { label: 'Current Streak', value: '5 days', icon: '🔥', color: 'text-orange-400' },
    { label: 'XP Earned', value: '2,450', icon: '⚡', color: 'text-yellow-400' },
    { label: 'Elo Rating', value: '1,340', icon: '📊', color: 'text-blue-400' },
  ];

  const quickLinks = [
    { href: '/problems', label: 'Practice Problems', icon: '🧩', description: 'Solve coding challenges' },
    { href: '/contests/active', label: 'Live Contest', icon: '⚔️', description: 'Compete in real-time' },
    { href: '/contests/leaderboard', label: 'Leaderboard', icon: '🏆', description: 'Global rankings' },
    { href: '/profile', label: 'Your Profile', icon: '👤', description: 'Stats & badges' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span>⚒️</span>
          <span className="text-white">ChainForge</span>
          <span className="text-blue-400">Academy</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            Welcome, {user?.name ?? user?.email ?? 'Forger'}!
          </span>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            ⚡ Lvl 4
          </Badge>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Track your progress and continue forging your skills</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/80 backdrop-blur border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link href={link.href}>
                <Card className="bg-slate-900/80 backdrop-blur border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="text-3xl mb-2">{link.icon}</div>
                    <CardTitle className="text-white text-base">{link.label}</CardTitle>
                    <CardDescription className="text-slate-400">{link.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <Card className="bg-slate-900/80 backdrop-blur border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Progress to Next Level</CardTitle>
            <CardDescription className="text-slate-400">2,450 / 3,000 XP</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={82} className="h-3" />
            <p className="text-slate-400 text-sm mt-2">550 XP needed to reach Level 5</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

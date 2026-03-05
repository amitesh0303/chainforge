'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealtime } from '@/hooks/use-realtime';
import { motion } from 'framer-motion';
import type { ContestParticipant } from '@/types';

const MOCK_CONTEST = {
  id: '1',
  title: 'EVM Security Challenge #12',
  startTime: new Date(Date.now() - 45 * 60 * 1000),
  durationMinutes: 120,
  status: 'active' as const,
  problems: ['A', 'B', 'C'],
};

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'soliditymaster', score: 300, solved: 3 },
  { rank: 2, username: 'web3dev_eth', score: 200, solved: 2 },
  { rank: 3, username: 'rustacean99', score: 150, solved: 2 },
  { rank: 4, username: 'you', score: 100, solved: 1 },
  { rank: 5, username: 'defi_builder', score: 0, solved: 0 },
];

export function ContestArena() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTab, setActiveTab] = useState('A');

  useEffect(() => {
    const endTime = new Date(MOCK_CONTEST.startTime).getTime() + MOCK_CONTEST.durationMinutes * 60 * 1000;
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, endTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useRealtime('contest_participants', (payload: ContestParticipant) => {
    console.log('Leaderboard update:', payload);
  });

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold">⚒️ ChainForge</span>
          <span className="text-slate-400">|</span>
          <span className="font-semibold text-white">{MOCK_CONTEST.title}</span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LIVE</Badge>
        </div>
        <div className="flex items-center gap-2 font-mono text-xl">
          <span className="text-slate-400">⏱</span>
          <span className={`font-bold ${timeLeft < 300000 ? 'text-red-400' : 'text-white'}`}>
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-60px)]">
        <div className="flex-1 flex flex-col">
          <div className="flex gap-2 p-4 border-b border-slate-800">
            {MOCK_CONTEST.problems.map((p) => (
              <Button
                key={p}
                variant={activeTab === p ? 'default' : 'outline'}
                onClick={() => setActiveTab(p)}
                className={activeTab === p ? 'bg-blue-600' : 'border-slate-700 text-slate-300'}
              >
                Problem {p}
              </Button>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-white mb-2">
                Problem {activeTab}: {activeTab === 'A' ? 'Fix Reentrancy' : activeTab === 'B' ? 'Gas Optimization' : 'ERC20 Token'}
              </h2>
              <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {activeTab === 'A' ? 'Medium' : activeTab === 'B' ? 'Hard' : 'Easy'}
              </Badge>
              <p className="text-slate-300">
                {activeTab === 'A'
                  ? 'Fix the reentrancy vulnerability in the provided lottery contract following the Checks-Effects-Interactions pattern.'
                  : activeTab === 'B'
                  ? 'Optimize the provided ERC-20 contract to reduce gas costs by at least 20%.'
                  : 'Implement a basic ERC-20 token with mint and burn capabilities.'}
              </p>
              <div className="mt-6">
                <Button className="bg-blue-600 hover:bg-blue-700">Open Editor →</Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="w-72 border-l border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-white flex items-center gap-2">
              🏆 Live Leaderboard
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            {MOCK_LEADERBOARD.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-3 border-b border-slate-800/50 flex items-center gap-3 ${
                  entry.username === 'you' ? 'bg-blue-500/10' : ''
                }`}
              >
                <span className={`font-bold w-6 text-center ${
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-slate-300' :
                  entry.rank === 3 ? 'text-amber-600' :
                  'text-slate-500'
                }`}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{entry.username}</div>
                  <div className="text-xs text-slate-400">{entry.solved} solved</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-400">{entry.score}</div>
                  <div className="text-xs text-slate-500">pts</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

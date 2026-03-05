'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubmissions } from '@/hooks/use-submissions';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const SAMPLE_PROBLEM = {
  id: '1',
  slug: 'vulnerable-lottery-fix',
  title: 'Fix the Vulnerable Lottery',
  description: `## Problem\n\nA lottery contract has a reentrancy vulnerability. Your task is to fix it.\n\n## Hints\n- Follow the Checks-Effects-Interactions pattern\n- Update state before making external calls`,
  difficulty: 'medium' as const,
  chain: 'evm' as const,
  language: 'solidity' as const,
  initialCode: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract Lottery {\n    mapping(address => uint256) public balances;\n    \n    function deposit() external payable {\n        balances[msg.sender] += msg.value;\n    }\n    \n    // Fix the reentrancy vulnerability\n    function withdraw() external {\n        uint256 amount = balances[msg.sender];\n        (bool success,) = msg.sender.call{value: amount}("");\n        require(success, "Transfer failed");\n        balances[msg.sender] = 0;\n    }\n}`,
  hints: ['Follow Checks-Effects-Interactions pattern', 'Update state before external calls'],
  xpReward: 150,
  tags: ['reentrancy', 'security', 'EVM'],
};

interface ProblemPageProps {
  slug: string;
}

export function ProblemPage({ slug: _slug }: ProblemPageProps) {
  const [code, setCode] = useState(SAMPLE_PROBLEM.initialCode);
  const [activeTab, setActiveTab] = useState('description');
  const { submitCode, isSubmitting, result } = useSubmissions();

  const handleSubmit = async () => {
    toast.loading('Submitting solution...', { id: 'submit' });
    await submitCode(SAMPLE_PROBLEM.id, code, SAMPLE_PROBLEM.language);
    toast.dismiss('submit');
    if (result?.status === 'accepted') {
      toast.success(`✅ Accepted! +${SAMPLE_PROBLEM.xpReward} XP`);
    } else if (result) {
      toast.error(`❌ ${result.status.replace(/_/g, ' ')}`);
    }
  };

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <nav className="border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 font-bold">
          <span>⚒️</span>
          <span className="text-white">ChainForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={difficultyColors[SAMPLE_PROBLEM.difficulty]}>
            {SAMPLE_PROBLEM.difficulty}
          </Badge>
          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
            {SAMPLE_PROBLEM.chain.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
            ⚡ +{SAMPLE_PROBLEM.xpReward} XP
          </Badge>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-slate-800">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 bg-slate-800/50">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="hints">Hints</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="flex-1 overflow-auto p-4">
              <h1 className="text-xl font-bold text-white mb-4">{SAMPLE_PROBLEM.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {SAMPLE_PROBLEM.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-line">
                {SAMPLE_PROBLEM.description}
              </div>
            </TabsContent>
            <TabsContent value="hints" className="flex-1 overflow-auto p-4">
              <h2 className="font-bold text-white mb-4">Progressive Hints</h2>
              <div className="space-y-3">
                {SAMPLE_PROBLEM.hints.map((hint, i) => (
                  <Card key={i} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-4 pb-4">
                      <span className="text-slate-400 text-sm font-medium">Hint {i + 1}</span>
                      <p className="text-slate-200 mt-1">{hint}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="submissions" className="flex-1 overflow-auto p-4">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className={`border ${result.status === 'accepted' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                    <CardHeader>
                      <CardTitle className={result.status === 'accepted' ? 'text-green-400' : 'text-red-400'}>
                        {result.status === 'accepted' ? '✅ Accepted' : `❌ ${result.status.replace(/_/g, ' ')}`}
                      </CardTitle>
                    </CardHeader>
                    {result.output && (
                      <CardContent>
                        <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap">{result.output}</pre>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <p className="text-slate-400">No submissions yet. Submit your solution!</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              defaultLanguage="sol"
              value={code}
              onChange={(v) => setCode(v ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
          <div className="p-4 border-t border-slate-800 flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
            >
              {isSubmitting ? '⏳ Running...' : '▶ Submit Solution'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCode(SAMPLE_PROBLEM.initialCode)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

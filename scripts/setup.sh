#!/bin/bash
set -e

echo "🔨 ChainForge Academy - Dev Setup"
echo "=================================="

command -v node >/dev/null 2>&1 || { echo "Node.js v20+ required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm required"; exit 1; }

echo "📦 Installing dependencies..."
npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "⚠️  Created .env.local — please fill in your API keys"
fi

echo "✅ Setup complete! Run 'npm run dev' to start"
echo "🌐 Open http://localhost:3000"

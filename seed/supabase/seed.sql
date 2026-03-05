-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE chain_type AS ENUM ('evm', 'solana', 'move');
CREATE TYPE submission_status AS ENUM ('pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'compilation_error', 'runtime_error');
CREATE TYPE contest_status AS ENUM ('upcoming', 'active', 'completed');
CREATE TYPE badge_type AS ENUM ('first_solve', 'streak_7', 'streak_30', 'contest_winner', 'evm_master', 'solana_master', 'move_master');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  wallet_address TEXT UNIQUE,
  google_id TEXT UNIQUE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  elo_rating INTEGER NOT NULL DEFAULT 1200,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty difficulty_level NOT NULL,
  chain chain_type NOT NULL,
  initial_code TEXT NOT NULL,
  test_cases JSONB NOT NULL DEFAULT '[]',
  xp_reward INTEGER NOT NULL DEFAULT 100,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'pending',
  execution_time_ms INTEGER,
  gas_used BIGINT,
  earned_xp INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contests table
CREATE TABLE IF NOT EXISTS contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  problem_ids UUID[] NOT NULL DEFAULT '{}',
  status contest_status NOT NULL DEFAULT 'upcoming'
);

-- Contest participants table
CREATE TABLE IF NOT EXISTS contest_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  problems_solved INTEGER NOT NULL DEFAULT 0,
  rating_change INTEGER,
  UNIQUE(contest_id, user_id)
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  minted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  token_id TEXT,
  UNIQUE(user_id, badge_type)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_contest_participants_contest_id ON contest_participants(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_participants_user_id ON contest_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_slug ON problems(slug);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_chain ON problems(chain);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Anyone can read problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Users can read own submissions" ON submissions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Anyone can read contests" ON contests FOR SELECT USING (true);
CREATE POLICY "Anyone can read contest participants" ON contest_participants FOR SELECT USING (true);
CREATE POLICY "Users can read own badges" ON user_badges FOR SELECT USING (auth.uid()::text = user_id::text);

-- Seed Problems
INSERT INTO problems (slug, title, description, difficulty, chain, initial_code, test_cases, xp_reward, tags) VALUES
(
  'vulnerable-lottery-fix',
  'Fix the Vulnerable Lottery',
  E'## Problem\n\nA lottery contract has a critical reentrancy vulnerability. Your task is to fix it using the Checks-Effects-Interactions pattern.\n\n## Background\n\nReentrancy attacks occur when a contract calls an external contract before updating its own state.\n\n## Your Task\n\nFix the `withdraw()` function to prevent reentrancy attacks.',
  'medium',
  'evm',
  E'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract Lottery {\n    mapping(address => uint256) public balances;\n    \n    function deposit() external payable {\n        balances[msg.sender] += msg.value;\n    }\n    \n    // TODO: Fix the reentrancy vulnerability\n    function withdraw() external {\n        uint256 amount = balances[msg.sender];\n        (bool success,) = msg.sender.call{value: amount}("");\n        require(success, "Transfer failed");\n        balances[msg.sender] = 0;\n    }\n}',
  '[{"id": "1", "input": "", "expectedOutput": "reentrancy_protected", "isHidden": false}]',
  150,
  ARRAY['reentrancy', 'security', 'EVM', 'solidity']
),
(
  'erc20-basic',
  'Implement Basic ERC-20 Token',
  E'## Problem\n\nImplement a basic ERC-20 token contract with mint and burn capabilities.\n\n## Requirements\n\n- Standard ERC-20 interface (transfer, approve, transferFrom)\n- Mint function (only owner)\n- Burn function (any token holder)',
  'easy',
  'evm',
  E'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract MyToken {\n    string public name = "MyToken";\n    string public symbol = "MTK";\n    uint8 public decimals = 18;\n    uint256 public totalSupply;\n    address public owner;\n    \n    mapping(address => uint256) public balanceOf;\n    mapping(address => mapping(address => uint256)) public allowance;\n    \n    // TODO: Implement ERC-20 functions\n}',
  '[{"id": "1", "input": "mint(0x1234, 1000)", "expectedOutput": "1000", "isHidden": false}]',
  100,
  ARRAY['ERC20', 'tokens', 'EVM', 'solidity']
),
(
  'gas-optimization',
  'Gas Optimization Challenge',
  E'## Problem\n\nOptimize the provided storage contract to reduce gas costs by at least 30%.\n\n## Tips\n\n- Use `uint128` packing where possible\n- Consider storage slot layout\n- Use `calldata` instead of `memory` for read-only arrays',
  'hard',
  'evm',
  E'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\n// Unoptimized - refactor to save gas\ncontract UserRegistry {\n    struct User {\n        uint256 id;\n        bool active;\n        uint256 score;\n        bool premium;\n        address wallet;\n    }\n    \n    User[] public users;\n    \n    function addUser(address wallet, uint256 score) external {\n        users.push(User(users.length, true, score, false, wallet));\n    }\n}',
  '[{"id": "1", "input": "gas_check", "expectedOutput": "optimized", "isHidden": false}]',
  250,
  ARRAY['gas', 'optimization', 'storage', 'EVM']
),
(
  'simple-staking',
  'Simple Staking Contract',
  E'## Problem\n\nBuild a staking contract where users can stake ETH and earn rewards over time.\n\n## Requirements\n\n- Stake ETH\n- Calculate rewards (1% per day)\n- Unstake with rewards',
  'medium',
  'evm',
  E'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract SimpleStaking {\n    struct Stake {\n        uint256 amount;\n        uint256 startTime;\n    }\n    \n    mapping(address => Stake) public stakes;\n    \n    // TODO: Implement stake, calculateReward, and unstake functions\n}',
  '[{"id": "1", "input": "stake_1_eth", "expectedOutput": "staked", "isHidden": false}]',
  175,
  ARRAY['staking', 'DeFi', 'EVM', 'solidity']
),
(
  'solana-counter',
  'Solana Counter Program',
  E'## Problem\n\nCreate a simple counter program on Solana using the Anchor framework.\n\n## Requirements\n\n- Initialize a counter account\n- Increment the counter\n- Reset the counter (only authority)',
  'easy',
  'solana',
  E'use anchor_lang::prelude::*;\n\ndeclare_id!("Counter111111111111111111111111111111111111");\n\n#[program]\npub mod counter {\n    use super::*;\n    \n    // TODO: implement initialize, increment, reset\n}\n\n#[account]\npub struct Counter {\n    pub count: u64,\n    pub authority: Pubkey,\n}',
  '[{"id": "1", "input": "increment", "expectedOutput": "1", "isHidden": false}]',
  120,
  ARRAY['counter', 'anchor', 'Solana', 'rust']
),
(
  'solana-nft-mint',
  'Solana NFT Minting',
  E'## Problem\n\nImplement an NFT minting function using Metaplex standards on Solana.\n\n## Requirements\n\n- Mint a new NFT with metadata\n- Set royalties\n- Transfer NFT',
  'hard',
  'solana',
  E'use anchor_lang::prelude::*;\nuse mpl_token_metadata::instruction as mpl_instruction;\n\ndeclare_id!("NftMint1111111111111111111111111111111111111");\n\n#[program]\npub mod nft_mint {\n    use super::*;\n    \n    // TODO: Implement NFT minting\n}',
  '[{"id": "1", "input": "mint_nft", "expectedOutput": "minted", "isHidden": false}]',
  300,
  ARRAY['NFT', 'metaplex', 'Solana', 'rust']
),
(
  'move-coin',
  'Move Coin Implementation',
  E'## Problem\n\nCreate a custom coin module using the Move language on Aptos.\n\n## Requirements\n\n- Initialize coin\n- Mint coins (admin only)\n- Transfer coins between accounts',
  'medium',
  'move',
  E'module my_addr::my_coin {\n    use std::signer;\n    use aptos_framework::coin;\n    \n    struct MyCoin {}\n    \n    struct CoinCapabilities has key {\n        mint_cap: coin::MintCapability<MyCoin>,\n        burn_cap: coin::BurnCapability<MyCoin>,\n    }\n    \n    // TODO: Implement initialize, mint, transfer\n}',
  '[{"id": "1", "input": "mint_100", "expectedOutput": "100", "isHidden": false}]',
  200,
  ARRAY['coin', 'Move', 'Aptos', 'DeFi']
),
(
  'proxy-pattern',
  'Upgradeable Proxy Pattern',
  E'## Problem\n\nImplement a UUPS (Universal Upgradeable Proxy Standard) proxy pattern.\n\n## Requirements\n\n- Proxy contract with delegatecall\n- Implementation contract with upgrade logic\n- Admin-only upgrade function',
  'hard',
  'evm',
  E'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract ERC1967Proxy {\n    bytes32 private constant IMPLEMENTATION_SLOT = \n        bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);\n    \n    // TODO: Implement proxy with delegatecall and upgrade logic\n    \n    fallback() external payable {\n        // delegate to implementation\n    }\n}',
  '[{"id": "1", "input": "upgrade_check", "expectedOutput": "upgradeable", "isHidden": false}]',
  350,
  ARRAY['proxy', 'upgradeable', 'UUPS', 'EVM', 'solidity']
),
(
  'multisig-wallet',
  'Multi-Signature Wallet',
  E'## Problem\n\nBuild a multi-signature wallet that requires M-of-N signatures to execute transactions.\n\n## Requirements\n\n- Add/remove owners\n- Submit transaction proposals\n- Confirm/revoke confirmations\n- Execute when threshold met',
  'hard',
  'evm',
  E'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract MultiSigWallet {\n    address[] public owners;\n    uint256 public required;\n    \n    struct Transaction {\n        address to;\n        uint256 value;\n        bytes data;\n        bool executed;\n        uint256 confirmations;\n    }\n    \n    Transaction[] public transactions;\n    mapping(uint256 => mapping(address => bool)) public confirmed;\n    \n    // TODO: Implement submitTransaction, confirmTransaction, executeTransaction\n}',
  '[{"id": "1", "input": "2_of_3_multisig", "expectedOutput": "executed", "isHidden": false}]',
  300,
  ARRAY['multisig', 'wallet', 'security', 'EVM']
),
(
  'flash-loan-receiver',
  'Flash Loan Receiver',
  E'## Problem\n\nImplement a flash loan receiver that borrows funds, performs an arbitrage, and repays in one transaction.\n\n## Requirements\n\n- Implement AAVE flash loan callback interface\n- Perform mock arbitrage\n- Repay loan with premium',
  'hard',
  'evm',
  E'// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ninterface IFlashLoanReceiver {\n    function executeOperation(\n        address[] calldata assets,\n        uint256[] calldata amounts,\n        uint256[] calldata premiums,\n        address initiator,\n        bytes calldata params\n    ) external returns (bool);\n}\n\ncontract FlashLoanReceiver is IFlashLoanReceiver {\n    // TODO: Implement flash loan receiver\n}',
  '[{"id": "1", "input": "flash_loan_100_eth", "expectedOutput": "profit", "isHidden": false}]',
  400,
  ARRAY['flash-loan', 'DeFi', 'arbitrage', 'AAVE', 'EVM']
);

-- Seed a sample active contest
INSERT INTO contests (title, start_time, duration_minutes, status) VALUES
('EVM Security Challenge #12', NOW() - INTERVAL '45 minutes', 120, 'active');

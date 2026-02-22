export interface SimulatedQuest {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reward: string;
  hostName: string;
  hostAvatar: string;
  category: string;
  backgroundImage: string;
  steps: QuestStep[];
  tags: string[];
}

export interface QuestStep {
  id: string;
  title: string;
  instruction: string;
  actionType: 'deploy' | 'interact' | 'sign' | 'bridge' | 'verify';
  actionLabel: string;
  verificationHint: string;
}

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

const questImages = [
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
  'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80',
  'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80',
  'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
  'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
  'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80',
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80',
  'https://images.unsplash.com/photo-1644143379190-22c4d437be0b?w=800&q=80',
  'https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=800&q=80',
];

export const simulatedQuests: SimulatedQuest[] = [
  {
    id: 'quest-1',
    title: 'Deploy Your First Smart Contract',
    description: 'Learn the fundamentals of smart contract deployment on a testnet. You will write, compile, and deploy a basic Solidity contract.',
    difficulty: 'Beginner',
    reward: '50 XP + NFT Badge',
    hostName: 'Ethereum Foundation',
    hostAvatar: avatarUrl('ethereum'),
    category: 'Smart Contracts',
    backgroundImage: questImages[0],
    tags: ['Solidity', 'Testnet', 'Deploy'],
    steps: [
      { id: 's1', title: 'Set Up Environment', instruction: 'Install MetaMask and connect to Sepolia testnet. Get test ETH from the faucet.', actionType: 'interact', actionLabel: 'Connect Wallet', verificationHint: 'Wallet connected to Sepolia' },
      { id: 's2', title: 'Deploy Contract', instruction: 'Deploy the provided HelloWorld.sol contract using Remix IDE.', actionType: 'deploy', actionLabel: 'Submit TX Hash', verificationHint: 'Contract deployed successfully' },
    ],
  },
  {
    id: 'quest-2',
    title: 'Swap Tokens on Uniswap',
    description: 'Master decentralized exchange mechanics by performing a token swap on Uniswap V3 testnet.',
    difficulty: 'Beginner',
    reward: '30 XP',
    hostName: 'Uniswap Labs',
    hostAvatar: avatarUrl('uniswap'),
    category: 'DeFi',
    backgroundImage: questImages[1],
    tags: ['DeFi', 'Swap', 'Uniswap'],
    steps: [
      { id: 's1', title: 'Connect to Uniswap', instruction: 'Navigate to Uniswap testnet and connect your wallet.', actionType: 'interact', actionLabel: 'Verify Connection', verificationHint: 'Connected to Uniswap' },
      { id: 's2', title: 'Execute Swap', instruction: 'Swap 0.01 ETH for test USDC on Uniswap V3.', actionType: 'interact', actionLabel: 'Submit TX Hash', verificationHint: 'Swap completed' },
    ],
  },
  {
    id: 'quest-3',
    title: 'Bridge Assets Cross-Chain',
    description: 'Learn cross-chain interoperability by bridging tokens between Ethereum Sepolia and Arbitrum Sepolia.',
    difficulty: 'Intermediate',
    reward: '80 XP + NFT Badge',
    hostName: 'Arbitrum',
    hostAvatar: avatarUrl('arbitrum'),
    category: 'Cross-Chain',
    backgroundImage: questImages[2],
    tags: ['Bridge', 'L2', 'Arbitrum'],
    steps: [
      { id: 's1', title: 'Initiate Bridge', instruction: 'Use the official Arbitrum bridge to send 0.001 ETH from Sepolia to Arbitrum Sepolia.', actionType: 'bridge', actionLabel: 'Submit Bridge TX', verificationHint: 'Bridge transaction initiated' },
      { id: 's2', title: 'Confirm Receipt', instruction: 'Wait for the bridged assets to arrive and verify on Arbitrum Sepolia explorer.', actionType: 'verify', actionLabel: 'Verify Balance', verificationHint: 'Assets received on L2' },
    ],
  },
  {
    id: 'quest-4',
    title: 'Create an ERC-721 NFT Collection',
    description: 'Build and deploy your own NFT collection smart contract with metadata stored on IPFS.',
    difficulty: 'Intermediate',
    reward: '100 XP + NFT Badge',
    hostName: 'OpenSea',
    hostAvatar: avatarUrl('opensea'),
    category: 'NFTs',
    backgroundImage: questImages[3],
    tags: ['NFT', 'ERC-721', 'IPFS'],
    steps: [
      { id: 's1', title: 'Write Contract', instruction: 'Create an ERC-721 contract using OpenZeppelin libraries.', actionType: 'deploy', actionLabel: 'Deploy Contract', verificationHint: 'ERC-721 deployed' },
      { id: 's2', title: 'Mint NFT', instruction: 'Mint your first NFT from the deployed collection.', actionType: 'interact', actionLabel: 'Submit Mint TX', verificationHint: 'NFT minted successfully' },
    ],
  },
  {
    id: 'quest-5',
    title: 'Sign a Message with EIP-712',
    description: 'Understand typed structured data signing using EIP-712 standard for gasless transactions.',
    difficulty: 'Beginner',
    reward: '25 XP',
    hostName: 'MetaMask',
    hostAvatar: avatarUrl('metamask'),
    category: 'Security',
    backgroundImage: questImages[4],
    tags: ['EIP-712', 'Signatures', 'Security'],
    steps: [
      { id: 's1', title: 'Sign Message', instruction: 'Sign a typed structured message using your wallet. This demonstrates gasless verification.', actionType: 'sign', actionLabel: 'Sign Message', verificationHint: 'Message signed' },
      { id: 's2', title: 'Verify Signature', instruction: 'Submit the signature for onchain verification.', actionType: 'verify', actionLabel: 'Verify', verificationHint: 'Signature verified' },
    ],
  },
  {
    id: 'quest-6',
    title: 'Provide Liquidity on Aave',
    description: 'Learn lending protocol mechanics by supplying assets to Aave V3 on a testnet.',
    difficulty: 'Intermediate',
    reward: '75 XP',
    hostName: 'Aave',
    hostAvatar: avatarUrl('aave'),
    category: 'DeFi',
    backgroundImage: questImages[5],
    tags: ['Lending', 'Aave', 'DeFi'],
    steps: [
      { id: 's1', title: 'Supply Assets', instruction: 'Supply 0.01 ETH to Aave V3 on Sepolia testnet.', actionType: 'interact', actionLabel: 'Submit Supply TX', verificationHint: 'Assets supplied' },
      { id: 's2', title: 'Check Position', instruction: 'Verify your lending position and earned interest.', actionType: 'verify', actionLabel: 'Verify Position', verificationHint: 'Position verified' },
    ],
  },
  {
    id: 'quest-7',
    title: 'Deploy a DAO Governance Contract',
    description: 'Create a basic governance contract with proposal and voting mechanics using OpenZeppelin Governor.',
    difficulty: 'Advanced',
    reward: '150 XP + NFT Badge',
    hostName: 'Compound',
    hostAvatar: avatarUrl('compound'),
    category: 'Governance',
    backgroundImage: questImages[6],
    tags: ['DAO', 'Governance', 'Voting'],
    steps: [
      { id: 's1', title: 'Deploy Governor', instruction: 'Deploy the Governor contract with a governance token.', actionType: 'deploy', actionLabel: 'Deploy', verificationHint: 'Governor deployed' },
      { id: 's2', title: 'Create Proposal', instruction: 'Submit a governance proposal through your deployed contract.', actionType: 'interact', actionLabel: 'Submit Proposal TX', verificationHint: 'Proposal created' },
    ],
  },
  {
    id: 'quest-8',
    title: 'Interact with The Graph',
    description: 'Query blockchain data using The Graph protocol subgraphs and understand indexed data.',
    difficulty: 'Intermediate',
    reward: '60 XP',
    hostName: 'The Graph',
    hostAvatar: avatarUrl('thegraph'),
    category: 'Data',
    backgroundImage: questImages[7],
    tags: ['Indexing', 'GraphQL', 'Data'],
    steps: [
      { id: 's1', title: 'Query Subgraph', instruction: 'Write a GraphQL query to fetch recent Uniswap swaps from The Graph.', actionType: 'verify', actionLabel: 'Submit Query', verificationHint: 'Query returned results' },
      { id: 's2', title: 'Analyze Data', instruction: 'Parse the returned data and identify the largest swap in the last 24 hours.', actionType: 'verify', actionLabel: 'Submit Answer', verificationHint: 'Answer verified' },
    ],
  },
  {
    id: 'quest-9',
    title: 'Build a Multi-Sig Wallet',
    description: 'Deploy and interact with a multi-signature wallet that requires multiple approvals for transactions.',
    difficulty: 'Advanced',
    reward: '200 XP + NFT Badge',
    hostName: 'Safe (Gnosis)',
    hostAvatar: avatarUrl('gnosis'),
    category: 'Security',
    backgroundImage: questImages[8],
    tags: ['MultiSig', 'Safe', 'Security'],
    steps: [
      { id: 's1', title: 'Deploy Multi-Sig', instruction: 'Deploy a multi-sig wallet contract with 2-of-3 threshold.', actionType: 'deploy', actionLabel: 'Deploy', verificationHint: 'Multi-sig deployed' },
      { id: 's2', title: 'Execute Transaction', instruction: 'Submit and approve a transaction through the multi-sig.', actionType: 'interact', actionLabel: 'Submit TX', verificationHint: 'Transaction executed' },
    ],
  },
  {
    id: 'quest-10',
    title: 'Create a Token Vesting Contract',
    description: 'Build a time-locked token vesting contract used by protocols to distribute tokens to team and investors.',
    difficulty: 'Advanced',
    reward: '175 XP + NFT Badge',
    hostName: 'Chainlink',
    hostAvatar: avatarUrl('chainlink'),
    category: 'Tokenomics',
    backgroundImage: questImages[9],
    tags: ['Vesting', 'ERC-20', 'Tokenomics'],
    steps: [
      { id: 's1', title: 'Deploy Vesting Contract', instruction: 'Deploy a linear vesting contract with a 30-day cliff and 1-year duration.', actionType: 'deploy', actionLabel: 'Deploy', verificationHint: 'Vesting contract deployed' },
      { id: 's2', title: 'Claim Tokens', instruction: 'Fast-forward time on testnet and claim vested tokens.', actionType: 'interact', actionLabel: 'Claim TX', verificationHint: 'Tokens claimed' },
    ],
  },
];

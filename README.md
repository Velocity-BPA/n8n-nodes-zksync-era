# n8n-nodes-zksync-era

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for interacting with zkSync Era, Ethereum's Layer 2 scaling solution. This node provides comprehensive access to 7 key resources including accounts, transactions, blocks, paymasters, proofs, contracts, and tokens, enabling seamless integration of zkSync Era's zero-knowledge rollup capabilities into your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![zkSync Era](https://img.shields.io/badge/zkSync-Era-purple)
![Layer 2](https://img.shields.io/badge/Ethereum-Layer%202-green)
![Zero Knowledge](https://img.shields.io/badge/ZK-Rollup-orange)

## Features

- **Account Management** - Query account balances, nonces, and transaction history across zkSync Era
- **Transaction Processing** - Submit, track, and analyze Layer 2 transactions with minimal gas fees
- **Block Operations** - Access block data, confirmations, and chain state information
- **Paymaster Integration** - Leverage zkSync Era's native account abstraction for gasless transactions
- **Proof Verification** - Validate zero-knowledge proofs and batch submissions to L1
- **Smart Contracts** - Deploy and interact with contracts on zkSync Era's EVM-compatible environment
- **Token Operations** - Manage ERC-20 tokens, bridging, and native zkSync Era token features
- **Real-time Monitoring** - Track network status, finality, and cross-chain bridge operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-zksync-era`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-zksync-era
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-zksync-era.git
cd n8n-nodes-zksync-era
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-zksync-era
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your zkSync Era API key for authenticated requests | Yes |
| Network | Target network (mainnet, testnet, local) | Yes |
| RPC Endpoint | Custom RPC endpoint URL (optional) | No |
| Timeout | Request timeout in milliseconds (default: 30000) | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account balance for native and ERC-20 tokens |
| Get Nonce | Get current transaction nonce for an account |
| Get Transaction Count | Retrieve total transaction count for an account |
| Get Transaction History | Fetch paginated transaction history |
| Get Account Info | Get comprehensive account information |

### 2. Transactions

| Operation | Description |
|-----------|-------------|
| Send Transaction | Submit a new transaction to zkSync Era |
| Get Transaction | Retrieve transaction details by hash |
| Get Transaction Receipt | Get transaction receipt and execution status |
| Get Transaction Status | Check transaction confirmation status |
| Estimate Fee | Calculate transaction fees before submission |
| Get Batch Details | Retrieve information about transaction batches |

### 3. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by number or hash |
| Get Latest Block | Get the most recent confirmed block |
| Get Block Range | Fetch multiple blocks within a specified range |
| Get Block Transactions | List all transactions in a specific block |
| Get Finalized Block | Get the latest finalized block on L1 |

### 4. Paymasters

| Operation | Description |
|-----------|-------------|
| Get Paymaster | Retrieve paymaster contract information |
| Estimate Paymaster Fee | Calculate fees for paymaster-sponsored transactions |
| Get Supported Tokens | List tokens accepted by a paymaster |
| Validate Paymaster | Check paymaster contract validity |

### 5. Proofs

| Operation | Description |
|-----------|-------------|
| Get Proof | Retrieve zero-knowledge proof for a transaction |
| Verify Proof | Validate proof correctness |
| Get Batch Proof | Get aggregated proof for transaction batch |
| Get L1 Batch Status | Check batch submission status on Ethereum L1 |

### 6. Contracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy smart contract to zkSync Era |
| Call Contract | Execute read-only contract function |
| Send Contract Transaction | Execute state-changing contract function |
| Get Contract Code | Retrieve deployed contract bytecode |
| Get Contract ABI | Fetch contract application binary interface |
| Estimate Contract Gas | Calculate gas for contract interactions |

### 7. Tokens

| Operation | Description |
|-----------|-------------|
| Get Token Info | Retrieve token metadata and contract details |
| Get Token Balance | Check token balance for specific account |
| Transfer Token | Send ERC-20 tokens between accounts |
| Get Token Allowance | Check spending allowance between addresses |
| Get Supported Tokens | List all tokens available on zkSync Era |
| Bridge Token | Initiate token bridge between L1 and L2 |

## Usage Examples

```javascript
// Get account balance for zkSync Era
{
  "resource": "accounts",
  "operation": "getBalance",
  "address": "0x1234567890123456789012345678901234567890",
  "tokenAddress": "0x0000000000000000000000000000000000000000"
}
```

```javascript
// Send a transaction with minimal fees
{
  "resource": "transactions",
  "operation": "sendTransaction",
  "to": "0x742d35Cc6634C0532925a3b8D53C51678c5F4Ce0",
  "value": "0.01",
  "gasLimit": "21000",
  "maxFeePerGas": "250000000"
}
```

```javascript
// Deploy smart contract to zkSync Era
{
  "resource": "contracts",
  "operation": "deployContract",
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "abi": "[{\"inputs\":[],\"name\":\"constructor\",\"type\":\"constructor\"}]",
  "constructorArgs": []
}
```

```javascript
// Use paymaster for gasless transaction
{
  "resource": "paymasters",
  "operation": "estimatePaymasterFee",
  "paymasterAddress": "0x3cb2b87d10ac01736a65688f3e0fb1b070b3eea3",
  "tokenAddress": "0x5aea5775959fbc2557cc8789bc1bf90a239d9a91",
  "transactionData": "0x"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has necessary permissions |
| Insufficient Balance | Account lacks sufficient funds for transaction | Check account balance and add funds if needed |
| Gas Estimation Failed | Unable to calculate transaction gas requirements | Verify contract interaction parameters and network status |
| Transaction Reverted | Smart contract execution failed | Review contract function parameters and state requirements |
| Network Timeout | Request exceeded configured timeout limit | Increase timeout value or check network connectivity |
| Invalid Address | Provided address format is incorrect | Ensure address follows Ethereum address format (0x...) |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-zksync-era/issues)
- **zkSync Era Documentation**: [era.zksync.io/docs](https://era.zksync.io/docs/)
- **zkSync Era Discord**: [join.zksync.dev](https://join.zksync.dev/)
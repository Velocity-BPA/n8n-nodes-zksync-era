# n8n-nodes-zksync-era

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for interacting with zkSync Era, Ethereum's leading Layer 2 scaling solution. This node provides access to 7 comprehensive resources including accounts, transactions, blocks, bridges, paymasters, proofs, and smart contracts, enabling seamless integration with zkSync Era's high-performance blockchain infrastructure.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![zkSync Era](https://img.shields.io/badge/zkSync%20Era-Compatible-purple)
![Layer 2](https://img.shields.io/badge/Layer%202-Ethereum-green)
![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-Enabled-orange)

## Features

- **Account Management** - Query account balances, nonces, transaction history, and deploy accounts
- **Transaction Operations** - Send transactions, check status, estimate fees, and retrieve transaction details
- **Block Explorer** - Access block information, finalized blocks, and L1 batch details
- **Bridge Functionality** - Deposit and withdraw assets between Ethereum L1 and zkSync Era L2
- **Paymaster Integration** - Utilize account abstraction with custom fee payment methods
- **Proof Verification** - Generate and verify zero-knowledge proofs for transactions and blocks
- **Smart Contract Interaction** - Deploy, call, and manage smart contracts on zkSync Era
- **High Performance** - Leverage zkSync Era's fast finality and low transaction costs

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
| API Key | Your zkSync Era RPC endpoint API key | Yes |
| RPC URL | zkSync Era RPC endpoint URL (mainnet/testnet) | Yes |
| Network | Target network (mainnet, goerli, sepolia) | Yes |
| Private Key | Wallet private key for transaction signing | No* |

*Required only for operations that involve sending transactions or signing data

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve ETH or token balance for an account |
| Get Nonce | Get the current nonce for an account |
| Get Transaction History | Fetch transaction history for an account |
| Deploy Account | Deploy a new smart contract account |
| Get Account Info | Retrieve comprehensive account information |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Send Transaction | Submit a transaction to zkSync Era |
| Get Transaction | Retrieve transaction details by hash |
| Get Transaction Status | Check transaction confirmation status |
| Estimate Fee | Calculate gas fees for a transaction |
| Get Receipt | Get transaction receipt with logs and events |
| Wait for Confirmation | Wait for transaction to be confirmed |

### 3. Block

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by number or hash |
| Get Latest Block | Get the most recent block |
| Get Finalized Block | Get the latest finalized block |
| Get Block Range | Fetch multiple blocks within a range |
| Get L1 Batch | Retrieve L1 batch information |
| Get Block Details | Get comprehensive block data with transactions |

### 4. Bridge

| Operation | Description |
|-----------|-------------|
| Deposit | Bridge assets from Ethereum L1 to zkSync Era |
| Withdraw | Bridge assets from zkSync Era to Ethereum L1 |
| Get Deposit Status | Check status of L1 to L2 deposit |
| Get Withdrawal Status | Check status of L2 to L1 withdrawal |
| Estimate Deposit Fee | Calculate fees for depositing assets |
| Get Bridge History | Retrieve bridge transaction history |

### 5. Paymaster

| Operation | Description |
|-----------|-------------|
| Get Paymaster Balance | Check paymaster account balance |
| Submit Paymaster Transaction | Send transaction using paymaster |
| Estimate Paymaster Fee | Calculate fees when using paymaster |
| Get Paymaster Info | Retrieve paymaster configuration |
| Validate Paymaster | Check if paymaster can sponsor transaction |

### 6. Proof

| Operation | Description |
|-----------|-------------|
| Get Transaction Proof | Generate proof for a specific transaction |
| Get Block Proof | Generate proof for a block |
| Verify Proof | Verify a zero-knowledge proof |
| Get Proof Status | Check proof generation status |
| Get L1 Proof | Retrieve proof submitted to L1 |

### 7. Contract

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new smart contract |
| Call Contract | Execute a read-only contract function |
| Send Contract Transaction | Execute a state-changing contract function |
| Get Contract Info | Retrieve contract metadata and ABI |
| Estimate Contract Gas | Calculate gas for contract interactions |
| Get Contract Events | Retrieve events emitted by contract |

## Usage Examples

```javascript
// Get account balance
{
  "address": "0x1234567890123456789012345678901234567890",
  "tokenAddress": "0x0000000000000000000000000000000000000000" // ETH
}
```

```javascript
// Send a transaction
{
  "to": "0x9876543210987654321098765432109876543210",
  "value": "0.1", // ETH amount
  "gasLimit": 21000,
  "gasPrice": "250000000" // 0.25 Gwei
}
```

```javascript
// Deploy a smart contract
{
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "constructorArgs": ["Hello", "World"],
  "gasLimit": 2000000
}
```

```javascript
// Bridge deposit from L1 to L2
{
  "l1TokenAddress": "0xA0b86a33E6441c8C06DD2F11c6b6E1E77a6E7E2b",
  "amount": "100.0",
  "l2Address": "0x1234567890123456789012345678901234567890"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and RPC URL are correct |
| Insufficient Balance | Account lacks funds for transaction | Check account balance and add funds |
| Gas Estimation Failed | Unable to estimate transaction gas | Verify contract call parameters and network status |
| Transaction Reverted | Smart contract execution failed | Check contract state and function parameters |
| Network Timeout | RPC request timed out | Retry request or check network connectivity |
| Invalid Address | Provided address format is incorrect | Ensure address is valid zkSync Era format |

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
- **zkSync Era Documentation**: [era.zksync.io/docs](https://era.zksync.io/docs)
- **zkSync Era API Reference**: [era.zksync.io/docs/api](https://era.zksync.io/docs/api)
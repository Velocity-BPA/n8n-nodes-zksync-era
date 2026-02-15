# n8n-nodes-zksync-era

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with zkSync Era, providing access to 7+ key resources including blocks, accounts, contracts, logs, network information, bridging operations, and proof generation. Enables seamless automation of Layer 2 scaling operations with comprehensive zkSync Era blockchain functionality.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![zkSync Era](https://img.shields.io/badge/zkSync-Era-purple)
![Layer 2](https://img.shields.io/badge/Layer%202-Scaling-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Compatible-orange)

## Features

- **Block Operations** - Retrieve block information, transactions, and metadata from zkSync Era network
- **Account Management** - Query account balances, transaction history, and nonce information
- **Smart Contract Integration** - Deploy, call, and interact with smart contracts on zkSync Era
- **Event Logging** - Monitor and query contract events and transaction logs
- **Network Information** - Access network status, gas prices, and protocol parameters
- **Cross-Chain Bridging** - Facilitate deposits and withdrawals between Ethereum L1 and zkSync Era L2
- **Proof Generation** - Generate and verify zkSync Era transaction proofs for enhanced security
- **Batch Operations** - Execute multiple transactions efficiently using zkSync Era's batching capabilities

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
| Network | zkSync Era network (mainnet, testnet, local) | Yes |
| RPC URL | Custom RPC endpoint URL (optional, defaults to public endpoints) | No |
| Rate Limit | Requests per second limit (default: 10) | No |

## Resources & Operations

### 1. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by number or hash |
| Get Latest Block | Get the most recent block on the network |
| Get Block Range | Fetch multiple blocks within a specified range |
| Get Block Transactions | List all transactions in a specific block |

### 2. Accounts

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account balance for ETH or ERC-20 tokens |
| Get Nonce | Get the current nonce for an account |
| Get Transaction History | Fetch transaction history for an account |
| Get Account Info | Retrieve comprehensive account information |

### 3. Contracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new smart contract to zkSync Era |
| Call Contract | Execute a read-only contract function call |
| Send Transaction | Execute a state-changing contract transaction |
| Get Contract Code | Retrieve the bytecode of a deployed contract |
| Estimate Gas | Estimate gas costs for contract interactions |

### 4. Logs

| Operation | Description |
|-----------|-------------|
| Get Logs | Query event logs with filtering options |
| Get Transaction Logs | Retrieve logs for a specific transaction |
| Watch Logs | Set up real-time log monitoring |
| Parse Events | Decode event logs using contract ABI |

### 5. Network

| Operation | Description |
|-----------|-------------|
| Get Network Info | Retrieve network status and configuration |
| Get Gas Price | Get current gas price estimates |
| Get Chain ID | Retrieve the zkSync Era chain identifier |
| Check Sync Status | Monitor network synchronization status |

### 6. Bridging

| Operation | Description |
|-----------|-------------|
| Deposit to L2 | Bridge assets from Ethereum L1 to zkSync Era L2 |
| Withdraw to L1 | Initiate withdrawal from zkSync Era L2 to Ethereum L1 |
| Get Bridge Status | Check the status of bridge transactions |
| Finalize Withdrawal | Complete L1 withdrawal after challenge period |

### 7. Proofs

| Operation | Description |
|-----------|-------------|
| Generate Proof | Create cryptographic proof for transaction validity |
| Verify Proof | Validate a zkSync Era proof |
| Get Proof Status | Check the status of proof generation |
| Batch Proof | Generate proofs for multiple transactions |

## Usage Examples

```javascript
// Get account balance
{
  "resource": "accounts",
  "operation": "getBalance",
  "address": "0x742c96191095A9d9e85bC8FdFA1DA4b2e48A8Dc7",
  "token": "ETH"
}
```

```javascript
// Deploy a smart contract
{
  "resource": "contracts",
  "operation": "deployContract",
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "constructorArgs": ["Hello, zkSync Era!"],
  "gasLimit": 2000000
}
```

```javascript
// Bridge ETH to zkSync Era
{
  "resource": "bridging",
  "operation": "depositToL2",
  "amount": "0.1",
  "token": "ETH",
  "recipient": "0x742c96191095A9d9e85bC8FdFA1DA4b2e48A8Dc7"
}
```

```javascript
// Monitor contract events
{
  "resource": "logs",
  "operation": "getLogs",
  "fromBlock": 1000000,
  "toBlock": "latest",
  "address": "0xA1cf087DB965Ab02Fb3CFaCe1f5c63935815f044",
  "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided API key | Verify API key in credentials configuration |
| Rate Limit Exceeded | Too many requests sent in short time period | Reduce request frequency or upgrade API plan |
| Network Unreachable | Cannot connect to zkSync Era network | Check network configuration and RPC URL |
| Insufficient Balance | Account lacks funds for transaction | Ensure account has sufficient ETH for gas fees |
| Contract Not Found | Specified contract address does not exist | Verify contract address and deployment status |
| Invalid Transaction | Transaction parameters are malformed | Check transaction data, gas limits, and nonce |

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
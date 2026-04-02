/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-zksyncera/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class zkSyncEra implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'zkSync Era',
    name: 'zksyncera',
    icon: 'file:zksyncera.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the zkSync Era API',
    defaults: {
      name: 'zkSync Era',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'zksynceraApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Bridge',
            value: 'bridge',
          },
          {
            name: 'Paymaster',
            value: 'paymaster',
          },
          {
            name: 'Proof',
            value: 'proof',
          },
          {
            name: 'Contract',
            value: 'contract',
          },
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'Paymasters',
            value: 'paymasters',
          },
          {
            name: 'Proofs',
            value: 'proofs',
          },
          {
            name: 'Contracts',
            value: 'contracts',
          },
          {
            name: 'Tokens',
            value: 'tokens',
          }
        ],
        default: 'account',
      },
      // Operation dropdowns per resource
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['account'],
		},
	},
	options: [
		{
			name: 'Get Balance',
			value: 'getBalance',
			description: 'Get account balance',
			action: 'Get account balance',
		},
		{
			name: 'Get Transaction Count',
			value: 'getTransactionCount',
			description: 'Get account nonce',
			action: 'Get account transaction count',
		},
		{
			name: 'Get Code',
			value: 'getCode',
			description: 'Get account code',
			action: 'Get account code',
		},
		{
			name: 'Get Storage At',
			value: 'getStorageAt',
			description: 'Get storage at specific position',
			action: 'Get storage at position',
		},
		{
			name: 'Get Account Details',
			value: 'zksGetAccount',
			description: 'Get zkSync account details',
			action: 'Get zkSync account details',
		},
	],
	default: 'getBalance',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
		},
	},
	options: [
		{
			name: 'Send Transaction',
			value: 'sendTransaction',
			description: 'Send a transaction',
			action: 'Send transaction',
		},
		{
			name: 'Send Raw Transaction',
			value: 'sendRawTransaction',
			description: 'Send raw signed transaction',
			action: 'Send raw transaction',
		},
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Get transaction by hash',
			action: 'Get transaction',
		},
		{
			name: 'Get Transaction Receipt',
			value: 'getTransactionReceipt',
			description: 'Get transaction receipt',
			action: 'Get transaction receipt',
		},
		{
			name: 'Get Transaction by Block Hash and Index',
			value: 'getTransactionByBlockHashAndIndex',
			description: 'Get transaction by block hash and index',
			action: 'Get transaction by block hash and index',
		},
		{
			name: 'Get Transaction by Block Number and Index',
			value: 'getTransactionByBlockNumberAndIndex',
			description: 'Get transaction by block number and index',
			action: 'Get transaction by block number and index',
		},
		{
			name: 'Get zkSync Transaction Details',
			value: 'zksGetTransactionDetails',
			description: 'Get zkSync transaction details',
			action: 'Get zkSync transaction details',
		},
    {
      name: 'Estimate Fee',
      value: 'estimateFee',
      description: 'Estimate transaction fee using zks_estimateFee',
      action: 'Estimate fee',
    },
    {
      name: 'Estimate Gas L1 to L2',
      value: 'estimateGasL1ToL2',
      description: 'Estimate gas cost for L1 to L2 transaction',
      action: 'Estimate gas L1 to L2',
    },
    {
      name: 'Call Contract',
      value: 'call',
      description: 'Execute a read-only contract call',
      action: 'Call contract',
    },
	],
	default: 'sendTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['block'] } },
  options: [
    { name: 'Get Latest Block Number', value: 'getBlockNumber', description: 'Get the latest block number', action: 'Get latest block number' },
    { name: 'Get Block by Hash', value: 'getBlockByHash', description: 'Get block information by hash', action: 'Get block by hash' },
    { name: 'Get Block by Number', value: 'getBlockByNumber', description: 'Get block information by number', action: 'Get block by number' },
    { name: 'Get zkSync Block Details', value: 'zksGetBlockDetails', description: 'Get zkSync specific block details', action: 'Get zkSync block details' },
    { name: 'Get L1 Batch Number', value: 'zksGetL1BatchNumber', description: 'Get the latest L1 batch number', action: 'Get L1 batch number' },
    { name: 'Get L1 Batch Details', value: 'zksGetL1BatchDetails', description: 'Get L1 batch details by number', action: 'Get L1 batch details' }
  ],
  default: 'getBlockNumber',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['bridge'] } },
  options: [
    { name: 'Get Bridge Contracts', value: 'getBridgeContracts', description: 'Get bridge contract addresses', action: 'Get bridge contracts' },
    { name: 'Get L2 To L1 Log Proof', value: 'getL2ToL1LogProof', description: 'Get L2 to L1 log proof', action: 'Get L2 to L1 log proof' },
    { name: 'Get L2 To L1 Message Proof', value: 'getL2ToL1MsgProof', description: 'Get L2 to L1 message proof', action: 'Get L2 to L1 message proof' },
    { name: 'Get L1 Chain ID', value: 'getL1ChainId', description: 'Get L1 chain ID', action: 'Get L1 chain ID' },
    { name: 'Get Confirmed Tokens', value: 'getConfirmedTokens', description: 'Get confirmed bridge tokens', action: 'Get confirmed tokens' }
  ],
  default: 'getBridgeContracts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['paymaster'] } },
  options: [
    { name: 'Estimate Fee', value: 'estimateFee', description: 'Estimate fee with paymaster for gasless transactions', action: 'Estimate fee with paymaster' },
    { name: 'Estimate Gas L1 to L2', value: 'estimateGasL1ToL2', description: 'Estimate gas for L1 to L2 transaction', action: 'Estimate gas for L1 to L2 transaction' },
    { name: 'Get Testnet Paymaster', value: 'getTestnetPaymaster', description: 'Get testnet paymaster address', action: 'Get testnet paymaster address' }
  ],
  default: 'estimateFee',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['proof'],
		},
	},
	options: [
		{
			name: 'Get Merkle Proof',
			value: 'getMerkleProof',
			description: 'Get Merkle proof for account',
			action: 'Get Merkle proof for account',
		},
		{
			name: 'Get Raw Block Transactions',
			value: 'getRawBlockTransactions',
			description: 'Get raw block transactions for proof generation',
			action: 'Get raw block transactions for proof generation',
		},
		{
			name: 'Get Block Details',
			value: 'getBlockDetails',
			description: 'Get block details for proof verification',
			action: 'Get block details for proof verification',
		},
	],
	default: 'getMerkleProof',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['contract'] } },
	options: [
		{ name: 'Call Contract Method', value: 'call', description: 'Call a contract method', action: 'Call contract method' },
		{ name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for contract call', action: 'Estimate gas for contract call' },
		{ name: 'Get Logs', value: 'getLogs', description: 'Get contract event logs', action: 'Get contract event logs' },
		{ name: 'Get Token Price', value: 'zksGetTokenPrice', description: 'Get token price from contract', action: 'Get token price from contract' },
	],
	default: 'call',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get Account Balance',
      value: 'getBalance',
      description: 'Get account balance for the specified address',
      action: 'Get account balance',
    },
    {
      name: 'Get Account Details',
      value: 'getAccountDetails',
      description: 'Get account details including nonce and verification',
      action: 'Get account details',
    },
    {
      name: 'Get Transaction Count',
      value: 'getTransactionCount',
      description: 'Get account nonce (transaction count)',
      action: 'Get transaction count',
    },
    {
      name: 'Get All Account Balances',
      value: 'getAllAccountBalances',
      description: 'Get all token balances for the specified account',
      action: 'Get all account balances',
    },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'Send Raw Transaction',
      value: 'sendRawTransaction',
      description: 'Send a signed transaction to the network',
      action: 'Send raw transaction',
    },
    {
      name: 'Get Transaction by Hash',
      value: 'getTransactionByHash',
      description: 'Retrieve transaction details by hash',
      action: 'Get transaction by hash',
    },
    {
      name: 'Get Transaction Receipt',
      value: 'getTransactionReceipt',
      description: 'Get transaction receipt by hash',
      action: 'Get transaction receipt',
    },
    {
      name: 'Estimate Fee',
      value: 'estimateFee',
      description: 'Estimate transaction fee using zks_estimateFee',
      action: 'Estimate fee',
    },
    {
      name: 'Estimate Gas L1 to L2',
      value: 'estimateGasL1ToL2',
      description: 'Estimate gas cost for L1 to L2 transaction',
      action: 'Estimate gas L1 to L2',
    },
    {
      name: 'Call Contract',
      value: 'call',
      description: 'Execute a read-only contract call',
      action: 'Call contract',
    },
  ],
  default: 'sendRawTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
    },
  },
  options: [
    {
      name: 'Get Block by Number',
      value: 'getBlockByNumber',
      description: 'Get block information by block number',
      action: 'Get block by number',
    },
    {
      name: 'Get Block by Hash',
      value: 'getBlockByHash',
      description: 'Get block information by block hash',
      action: 'Get block by hash',
    },
    {
      name: 'Get L1 Batch Number',
      value: 'getL1BatchNumber',
      description: 'Get the latest L1 batch number',
      action: 'Get L1 batch number',
    },
    {
      name: 'Get L1 Batch Details',
      value: 'getL1BatchDetails',
      description: 'Get L1 batch details by batch number',
      action: 'Get L1 batch details',
    },
    {
      name: 'Get Block Details',
      value: 'getBlockDetails',
      description: 'Get zkSync block details by block number',
      action: 'Get zkSync block details',
    },
  ],
  default: 'getBlockByNumber',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['paymasters'],
    },
  },
  options: [
    {
      name: 'Estimate Fee with Paymaster',
      value: 'estimateFee',
      description: 'Estimate transaction fee using paymaster for gasless transactions',
      action: 'Estimate fee with paymaster',
    },
    {
      name: 'Send Paymaster Transaction',
      value: 'sendTransaction',
      description: 'Send a signed transaction using paymaster',
      action: 'Send paymaster transaction',
    },
    {
      name: 'Get Token Price',
      value: 'getTokenPrice',
      description: 'Get token price for paymaster calculations',
      action: 'Get token price for paymaster',
    },
  ],
  default: 'estimateFee',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
    },
  },
  options: [
    {
      name: 'Get Proof',
      value: 'getProof',
      description: 'Get Merkle proof for account/storage',
      action: 'Get Merkle proof for account or storage',
    },
    {
      name: 'Get L1 Batch Details',
      value: 'getL1BatchDetails',
      description: 'Get batch with proof details',
      action: 'Get L1 batch details with proof',
    },
    {
      name: 'Get L2 To L1 Log Proof',
      value: 'getL2ToL1LogProof',
      description: 'Get log proof for withdrawals',
      action: 'Get L2 to L1 log proof for withdrawals',
    },
  ],
  default: 'getProof',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
    },
  },
  options: [
    {
      name: 'Call Contract Function',
      value: 'callFunction',
      description: 'Call a contract function using eth_call',
      action: 'Call contract function',
    },
    {
      name: 'Get Contract Details',
      value: 'getDetails',
      description: 'Get contract deployment details',
      action: 'Get contract details',
    },
    {
      name: 'Get Contract Code',
      value: 'getCode',
      description: 'Get contract bytecode',
      action: 'Get contract code',
    },
    {
      name: 'Get Bytecode by Hash',
      value: 'getBytecodeByHash',
      description: 'Get bytecode by hash',
      action: 'Get bytecode by hash',
    },
  ],
  default: 'callFunction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
    },
  },
  options: [
    {
      name: 'Get All Account Balances',
      value: 'getAllAccountBalances',
      description: 'Get all token balances for an account',
      action: 'Get all account balances',
    },
    {
      name: 'Get Token Price',
      value: 'getTokenPrice',
      description: 'Get the current price of a token',
      action: 'Get token price',
    },
    {
      name: 'Get Confirmed Tokens',
      value: 'getConfirmedTokens',
      description: 'Get list of confirmed tokens',
      action: 'Get confirmed tokens',
    },
    {
      name: 'Call Token Contract',
      value: 'callTokenContract',
      description: 'Call token contract methods',
      action: 'Call token contract',
    },
  ],
  default: 'getAllAccountBalances',
},
      // Parameter definitions
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBalance', 'getTransactionCount', 'getCode', 'getStorageAt', 'zksGetAccount'],
		},
	},
	default: '',
	description: 'The account address',
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBalance', 'getTransactionCount', 'getCode', 'getStorageAt', 'zksGetAccount'],
		},
	},
	default: 'latest',
	description: 'Block number or tag (latest, earliest, pending)',
},
{
	displayName: 'Storage Position',
	name: 'position',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getStorageAt'],
		},
	},
	default: '0x0',
	description: 'Storage position as hex string',
},
{
	displayName: 'Transaction',
	name: 'transaction',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendTransaction'],
		},
	},
	default: '{}',
	description: 'Transaction object to send',
},
{
	displayName: 'Raw Transaction Data',
	name: 'data',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendRawTransaction'],
		},
	},
	default: '',
	description: 'Raw signed transaction data',
},
{
	displayName: 'Transaction Hash',
	name: 'hash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction', 'getTransactionReceipt', 'zksGetTransactionDetails'],
		},
	},
	default: '',
	description: 'Transaction hash',
},
{
	displayName: 'Block Hash',
	name: 'blockHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionByBlockHashAndIndex'],
		},
	},
	default: '',
	description: 'Block hash',
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionByBlockNumberAndIndex'],
		},
	},
	default: '',
	description: 'Block number (hex string or "latest", "earliest", "pending")',
},
{
	displayName: 'Transaction Index',
	name: 'index',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionByBlockHashAndIndex', 'getTransactionByBlockNumberAndIndex'],
		},
	},
	default: '',
	description: 'Transaction index in the block (hex string)',
},
{
  displayName: 'Transaction Object',
  name: 'transaction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['estimateFee', 'estimateGasL1ToL2', 'call'],
    },
  },
  default: '{}',
  description: 'Transaction object with fields like from, to, data, value, etc.',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['call'],
    },
  },
  default: 'latest',
  description: 'Block number for the call (latest, earliest, pending, or hex block number)',
},
{
  displayName: 'Block Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByHash'] } },
  default: '',
  placeholder: '0x1234...',
  description: 'The hash of the block to retrieve',
},
{
  displayName: 'Include Full Transactions',
  name: 'fullTransactions',
  type: 'boolean',
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByHash', 'getBlockByNumber'] } },
  default: false,
  description: 'Whether to return full transaction objects or just transaction hashes',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByNumber', 'zksGetBlockDetails'] } },
  default: 'latest',
  placeholder: 'latest, earliest, or block number',
  description: 'The block number to retrieve (can be "latest", "earliest", or a specific number)',
},
{
  displayName: 'Batch Number',
  name: 'batchNumber',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['zksGetL1BatchDetails'] } },
  default: 1,
  description: 'The L1 batch number to retrieve details for',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['getL2ToL1LogProof'] } },
  default: '',
  description: 'The transaction hash for the L2 to L1 log proof',
},
{
  displayName: 'Log Index',
  name: 'logIndex',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['getL2ToL1LogProof'] } },
  default: 0,
  description: 'The log index for the L2 to L1 log proof',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['getL2ToL1MsgProof'] } },
  default: 0,
  description: 'The block number for the L2 to L1 message proof',
},
{
  displayName: 'Sender',
  name: 'sender',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['getL2ToL1MsgProof'] } },
  default: '',
  description: 'The sender address for the L2 to L1 message proof',
},
{
  displayName: 'Message',
  name: 'msg',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['getL2ToL1MsgProof'] } },
  default: '',
  description: 'The message for the L2 to L1 message proof',
},
{
  displayName: 'L2 Transaction Number in Block',
  name: 'l2TxNumberInBlock',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['getL2ToL1MsgProof'] } },
  default: 0,
  description: 'The L2 transaction number in block for the message proof',
},
{
  displayName: 'From',
  name: 'from',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['getConfirmedTokens'] } },
  default: 0,
  description: 'Starting index for confirmed tokens pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['getConfirmedTokens'] } },
  default: 100,
  description: 'Number of tokens to return (max 100)',
},
{
  displayName: 'Transaction',
  name: 'transaction',
  type: 'json',
  displayOptions: { show: { resource: ['paymaster'], operation: ['estimateFee'] } },
  default: '{}',
  description: 'Transaction object for fee estimation',
  required: true,
},
{
  displayName: 'Transaction',
  name: 'transaction',
  type: 'json',
  displayOptions: { show: { resource: ['paymaster'], operation: ['estimateGasL1ToL2'] } },
  default: '{}',
  description: 'Transaction object for gas estimation',
  required: true,
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['proof'],
			operation: ['getMerkleProof'],
		},
	},
	default: '',
	placeholder: '0x742d35Cc6634C0532925a3b8D4dA2fA0C5F4eb38',
	description: 'The account address to get Merkle proof for',
},
{
	displayName: 'Keys',
	name: 'keys',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['proof'],
			operation: ['getMerkleProof'],
		},
	},
	default: '[]',
	description: 'Array of storage keys to get proof for',
},
{
	displayName: 'L1 Batch Number',
	name: 'l1BatchNumber',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['proof'],
			operation: ['getMerkleProof'],
		},
	},
	default: 1,
	description: 'The L1 batch number to get proof for',
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['proof'],
			operation: ['getRawBlockTransactions', 'getBlockDetails'],
		},
	},
	default: 1,
	description: 'The block number to query',
},
{
	displayName: 'Transaction',
	name: 'transaction',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['call'] } },
	default: '{}',
	description: 'Transaction object for the contract call',
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'string',
	displayOptions: { show: { resource: ['contract'], operation: ['call'] } },
	default: 'latest',
	description: 'Block number to execute the call at',
},
{
	displayName: 'Transaction',
	name: 'transaction',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['estimateGas'] } },
	default: '{}',
	description: 'Transaction object for gas estimation',
},
{
	displayName: 'Filter',
	name: 'filter',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['getLogs'] } },
	default: '{}',
	description: 'Filter object for log retrieval',
},
{
	displayName: 'Token Address',
	name: 'tokenAddress',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['contract'], operation: ['zksGetTokenPrice'] } },
	default: '',
	description: 'Address of the token contract',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getBalance', 'getAccountDetails', 'getTransactionCount', 'getAllAccountBalances'],
    },
  },
  default: '',
  description: 'The account address (must be a valid hex address)',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getBalance', 'getAccountDetails', 'getTransactionCount'],
    },
  },
  default: 'latest',
  description: 'The block number (hex string), or "latest", "earliest", "pending"',
  placeholder: 'latest',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendRawTransaction'],
    },
  },
  default: '',
  description: 'The signed transaction data in hex format',
},
{
  displayName: 'Transaction Hash',
  name: 'transactionHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactionByHash', 'getTransactionReceipt'],
    },
  },
  default: '',
  description: 'The transaction hash to query',
},
{
  displayName: 'Transaction Object',
  name: 'transaction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['estimateFee', 'estimateGasL1ToL2', 'call'],
    },
  },
  default: '{}',
  description: 'Transaction object with fields like from, to, data, value, etc.',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['call'],
    },
  },
  default: 'latest',
  description: 'Block number for the call (latest, earliest, pending, or hex block number)',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByNumber'],
    },
  },
  default: 'latest',
  description: 'Block number in hex format (0x...) or "latest", "earliest", "pending"',
},
{
  displayName: 'Include Transactions',
  name: 'includeTransactions',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByNumber'],
    },
  },
  default: false,
  description: 'Whether to include full transaction objects or just transaction hashes',
},
{
  displayName: 'Block Hash',
  name: 'blockHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHash'],
    },
  },
  default: '',
  description: 'Block hash in hex format (0x...)',
},
{
  displayName: 'Include Transactions',
  name: 'includeTransactions',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHash'],
    },
  },
  default: false,
  description: 'Whether to include full transaction objects or just transaction hashes',
},
{
  displayName: 'Batch Number',
  name: 'batchNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getL1BatchDetails'],
    },
  },
  default: '',
  description: 'L1 batch number in hex format (0x...) or decimal',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockDetails'],
    },
  },
  default: '',
  description: 'Block number in hex format (0x...) or decimal',
},
{
  displayName: 'Transaction Object',
  name: 'transaction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymasters'],
      operation: ['estimateFee'],
    },
  },
  default: '{}',
  description: 'Transaction object to estimate fee for',
  placeholder: '{"to": "0x...", "data": "0x...", "value": "0x0"}',
},
{
  displayName: 'Paymaster Address',
  name: 'paymasterAddress',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['paymasters'],
      operation: ['estimateFee'],
    },
  },
  default: '',
  description: 'Address of the paymaster contract',
  placeholder: '0x...',
},
{
  displayName: 'Paymaster Input',
  name: 'paymasterInput',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['paymasters'],
      operation: ['estimateFee'],
    },
  },
  default: '0x',
  description: 'Input data for the paymaster',
  placeholder: '0x...',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymasters'],
      operation: ['sendTransaction'],
    },
  },
  default: '',
  description: 'The signed transaction data in hex format',
  placeholder: '0x...',
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymasters'],
      operation: ['getTokenPrice'],
    },
  },
  default: '',
  description: 'The token contract address to get price for',
  placeholder: '0x...',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getProof'],
    },
  },
  default: '',
  description: 'The account address to get proof for',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Keys',
  name: 'keys',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getProof'],
    },
  },
  default: '',
  description: 'Storage keys (comma-separated hex values)',
  placeholder: '0x1,0x2,0x3',
},
{
  displayName: 'L1 Batch Number',
  name: 'l1BatchNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getProof'],
    },
  },
  default: 'latest',
  description: 'L1 batch number or "latest"',
},
{
  displayName: 'Batch Number',
  name: 'batchNumber',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getL1BatchDetails'],
    },
  },
  default: 0,
  description: 'The batch number to get details for',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getL2ToL1LogProof'],
    },
  },
  default: '',
  description: 'Transaction hash containing the log',
  placeholder: '0x1234567890123456789012345678901234567890123456789012345678901234',
},
{
  displayName: 'Log Index',
  name: 'logIndex',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getL2ToL1LogProof'],
    },
  },
  default: 0,
  description: 'Index of the log in the transaction (optional)',
},
{
  displayName: 'Transaction Data',
  name: 'transaction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['callFunction'],
    },
  },
  default: '{"to": "0x...", "data": "0x..."}',
  description: 'Transaction object with to, data, from, gas, gasPrice, and value fields',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['callFunction'],
    },
  },
  default: 'latest',
  description: 'Block number to call at (latest, earliest, pending, or hex number)',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['getDetails'],
    },
  },
  default: '',
  description: 'The contract address to get details for',
},
{
  displayName: 'Contract Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['getCode'],
    },
  },
  default: '',
  description: 'The contract address to get code for',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['getCode'],
    },
  },
  default: 'latest',
  description: 'Block number to get code at (latest, earliest, pending, or hex number)',
},
{
  displayName: 'Bytecode Hash',
  name: 'bytecodeHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['getBytecodeByHash'],
    },
  },
  default: '',
  description: 'The bytecode hash to retrieve',
},
{
  displayName: 'Account Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getAllAccountBalances'],
    },
  },
  default: '',
  description: 'The account address to get token balances for',
  placeholder: '0x742d35Cc7F2c4C5D8C6c7C8C5c5c5c5c5c5c5c5c',
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenPrice'],
    },
  },
  default: '',
  description: 'The token contract address to get price for',
  placeholder: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
},
{
  displayName: 'From',
  name: 'from',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getConfirmedTokens'],
    },
  },
  default: 0,
  description: 'Offset for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getConfirmedTokens'],
    },
  },
  default: 100,
  description: 'Maximum number of tokens to return',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['callTokenContract'],
    },
  },
  default: '',
  description: 'The token contract address to call',
  placeholder: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['callTokenContract'],
    },
  },
  default: '',
  description: 'Encoded function call data (hex)',
  placeholder: '0x70a08231000000000000000000000000742d35cc7f2c4c5d8c6c7c8c5c5c5c5c5c5c5c5c',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['callTokenContract'],
    },
  },
  default: 'latest',
  description: 'Block number to execute the call at',
  placeholder: 'latest',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'bridge':
        return [await executeBridgeOperations.call(this, items)];
      case 'paymaster':
        return [await executePaymasterOperations.call(this, items)];
      case 'proof':
        return [await executeProofOperations.call(this, items)];
      case 'contract':
        return [await executeContractOperations.call(this, items)];
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'paymasters':
        return [await executePaymastersOperations.call(this, items)];
      case 'proofs':
        return [await executeProofsOperations.call(this, items)];
      case 'contracts':
        return [await executeContractsOperations.call(this, items)];
      case 'tokens':
        return [await executeTokensOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('zksynceraApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const address = this.getNodeParameter('address', i) as string;
			const blockNumber = this.getNodeParameter('blockNumber', i) as string;

			const baseOptions: any = {
				method: 'POST',
				url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${credentials.apiKey}`,
				},
				json: true,
			};

			switch (operation) {
				case 'getBalance': {
					const options = {
						...baseOptions,
						body: {
							id: 1,
							jsonrpc: '2.0',
							method: 'eth_getBalance',
							params: [address, blockNumber],
						},
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getTransactionCount': {
					const options = {
						...baseOptions,
						body: {
							id: 1,
							jsonrpc: '2.0',
							method: 'eth_getTransactionCount',
							params: [address, blockNumber],
						},
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getCode': {
					const options = {
						...baseOptions,
						body: {
							id: 1,
							jsonrpc: '2.0',
							method: 'eth_getCode',
							params: [address, blockNumber],
						},
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getStorageAt': {
					const position = this.getNodeParameter('position', i) as string;
					const options = {
						...baseOptions,
						body: {
							id: 1,
							jsonrpc: '2.0',
							method: 'eth_getStorageAt',
							params: [address, position, blockNumber],
						},
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'zksGetAccount': {
					const options = {
						...baseOptions,
						body: {
							id: 1,
							jsonrpc: '2.0',
							method: 'zks_getAccount',
							params: [address, blockNumber],
						},
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTransactionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('zksynceraApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const requestId = Math.floor(Math.random() * 1000000);

			switch (operation) {
				case 'sendTransaction': {
					const transaction = this.getNodeParameter('transaction', i) as any;
					const requestBody = {
						id: requestId,
						jsonrpc: '2.0',
						method: 'eth_sendTransaction',
						params: [transaction],
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'sendRawTransaction': {
					const data = this.getNodeParameter('data', i) as string;
					const requestBody = {
						id: requestId,
						jsonrpc: '2.0',
						method: 'eth_sendRawTransaction',
						params: [data],
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransaction': {
					const hash = this.getNodeParameter('hash', i) as string;
					const requestBody = {
						id: requestId,
						jsonrpc: '2.0',
						method: 'eth_getTransactionByHash',
						params: [hash],
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransactionReceipt': {
					const hash = this.getNodeParameter('hash', i) as string;
					const requestBody = {
						id: requestId,
						jsonrpc: '2.0',
						method: 'eth_getTransactionReceipt',
						params: [hash],
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransactionByBlockHashAndIndex': {
					const blockHash = this.getNodeParameter('blockHash', i) as string;
					const index = this.getNodeParameter('index', i) as string;
					const requestBody = {
						id: requestId,
						jsonrpc: '2.0',
						method: 'eth_getTransactionByBlockHashAndIndex',
						params: [blockHash, index],
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransactionByBlockNumberAndIndex': {
					const blockNumber = this.getNodeParameter('blockNumber', i) as string;
					const index = this.getNodeParameter('index', i) as string;
					const requestBody = {
						id: requestId,
						jsonrpc: '2.0',
						method: 'eth_getTransactionByBlockNumberAndIndex',
						params: [blockNumber, index],
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'zksGetTransactionDetails': {
					const hash = this.getNodeParameter('hash', i) as string;
					const requestBody = {
						id: requestId,
						jsonrpc: '2.0',
						method: 'zks_getTransactionDetails',
						params: [hash],
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

        case 'estimateFee': {
          const transaction = this.getNodeParameter('transaction', i) as any;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_estimateFee',
            params: [transaction],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'estimateGasL1ToL2': {
          const transaction = this.getNodeParameter('transaction', i) as any;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_estimateGasL1ToL2',
            params: [transaction],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'call': {
          const transaction = this.getNodeParameter('transaction', i) as any;
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [transaction, blockNumber],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeBlockOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INode
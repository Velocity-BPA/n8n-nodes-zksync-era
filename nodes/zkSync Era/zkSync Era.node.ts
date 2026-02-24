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
            name: 'unknown',
            value: 'unknown',
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
        default: 'accounts',
      },
      // Operation dropdowns per resource
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
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'unknown':
        return [await executeunknownOperations.call(this, items)];
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

async function executeAccountsOperations(
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

      // Validate address format
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new NodeOperationError(this.getNode(), `Invalid address format: ${address}. Address must be a 40-character hex string starting with 0x`);
      }

      switch (operation) {
        case 'getBalance': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [address, blockNumber || 'latest'],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          
          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error, {
              message: `zkSync Era API Error: ${response.error.message}`,
            });
          }

          result = {
            address,
            blockNumber: blockNumber || 'latest',
            balance: response.result,
            balanceWei: parseInt(response.result, 16).toString(),
            balanceEth: (parseInt(response.result, 16) / Math.pow(10, 18)).toString(),
          };
          break;
        }

        case 'getAccountDetails': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'zks_getAccount',
            params: [address, blockNumber || 'latest'],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          
          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error, {
              message: `zkSync Era API Error: ${response.error.message}`,
            });
          }

          result = {
            address,
            blockNumber: blockNumber || 'latest',
            accountDetails: response.result,
          };
          break;
        }

        case 'getTransactionCount': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getTransactionCount',
            params: [address, blockNumber || 'latest'],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          
          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error, {
              message: `zkSync Era API Error: ${response.error.message}`,
            });
          }

          result = {
            address,
            blockNumber: blockNumber || 'latest',
            nonce: response.result,
            nonceDecimal: parseInt(response.result, 16).toString(),
          };
          break;
        }

        case 'getAllAccountBalances': {
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'zks_getAllAccountBalances',
            params: [address],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          
          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error, {
              message: `zkSync Era API Error: ${response.error.message}`,
            });
          }

          result = {
            address,
            balances: response.result,
            tokenCount: Object.keys(response.result || {}).length,
          };
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message || 'Unknown error occurred' }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zksynceraApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'sendRawTransaction': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_sendRawTransaction',
            params: [signedTransaction],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getTransactionByHash': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transactionHash],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getTransactionReceipt': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
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
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
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
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
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
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
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

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error, { 
          message: `zkSync Era API error: ${result.error.message}`,
          description: result.error.data || 'API request failed'
        });
      }

      returnData.push({ 
        json: result.result || result, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBlocksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zksynceraApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getBlockByNumber': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const includeTransactions = this.getNodeParameter('includeTransactions', i, false) as boolean;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNumber, includeTransactions],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'getBlockByHash': {
          const blockHash = this.getNodeParameter('blockHash', i) as string;
          const includeTransactions = this.getNodeParameter('includeTransactions', i, false) as boolean;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByHash',
            params: [blockHash, includeTransactions],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'getL1BatchNumber': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getL1BatchNumber',
            params: [],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'getL1BatchDetails': {
          const batchNumber = this.getNodeParameter('batchNumber', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getL1BatchDetails',
            params: [batchNumber],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'getBlockDetails': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getBlockDetails',
            params: [blockNumber],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
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

// PARSE ERROR for unknown — manual fix needed
// Raw: // No additional imports

{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['bridging'],
    },
  },
  options: [
    {
      name: 'Get L2 to L1 Log Proof',
      value: 'getL2ToL1LogProof',
      descrip

async function executePaymastersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zksynceraApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'estimateFee': {
          const transaction = this.getNodeParameter('transaction', i) as any;
          const paymasterAddress = this.getNodeParameter('paymasterAddress', i, '') as string;
          const paymasterInput = this.getNodeParameter('paymasterInput', i, '0x') as string;

          let transactionObj: any;
          if (typeof transaction === 'string') {
            transactionObj = JSON.parse(transaction);
          } else {
            transactionObj = transaction;
          }

          // Add paymaster data if provided
          if (paymasterAddress) {
            transactionObj.paymaster = paymasterAddress;
            transactionObj.paymasterInput = paymasterInput;
          }

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'zks_estimateFee',
            params: [transactionObj],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': credentials.apiKey ? `Bearer ${credentials.apiKey}` : undefined,
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);

          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        case 'sendTransaction': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_sendRawTransaction',
            params: [signedTransaction],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': credentials.apiKey ? `Bearer ${credentials.apiKey}` : undefined,
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);

          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        case 'getTokenPrice': {
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'zks_getTokenPrice',
            params: [tokenAddress],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': credentials.apiKey ? `Bearer ${credentials.apiKey}` : undefined,
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);

          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
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

async function executeProofsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zksynceraApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getProof': {
          const address = this.getNodeParameter('address', i) as string;
          const keysParam = this.getNodeParameter('keys', i) as string;
          const l1BatchNumber = this.getNodeParameter('l1BatchNumber', i) as string;

          // Parse keys from comma-separated string
          const keys = keysParam.split(',').map((key: string) => key.trim());

          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getProof',
            params: [address, keys, l1BatchNumber],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        case 'getL1BatchDetails': {
          const batchNumber = this.getNodeParameter('batchNumber', i) as number;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getL1BatchDetails',
            params: [batchNumber],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        case 'getL2ToL1LogProof': {
          const txHash = this.getNodeParameter('txHash', i) as string;
          const logIndex = this.getNodeParameter('logIndex', i, 0) as number;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getL2ToL1LogProof',
            params: [txHash, logIndex],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://mainnet.era.zksync.io',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }

          result = responseData.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
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

async function executeContractsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zksynceraApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'callFunction': {
          const transaction = this.getNodeParameter('transaction', i) as any;
          const blockNumber = this.getNodeParameter('blockNumber', i, 'latest') as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [transaction, blockNumber],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDetails': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getContractDetails',
            params: [contractAddress],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCode': {
          const address = this.getNodeParameter('address', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i, 'latest') as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getCode',
            params: [address, blockNumber],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBytecodeByHash': {
          const bytecodeHash = this.getNodeParameter('bytecodeHash', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getBytecodeByHash',
            params: [bytecodeHash],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result, {
          message: `zkSync Era API Error: ${result.error.message}`,
          description: result.error.data || 'No additional error details provided',
        });
      }

      returnData.push({
        json: result.result || result,
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

async function executeTokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zksynceraApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAllAccountBalances': {
          const address = this.getNodeParameter('address', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getAllAccountBalances',
            params: [address],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }
        
        case 'getTokenPrice': {
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getTokenPrice',
            params: [tokenAddress],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }
        
        case 'getConfirmedTokens': {
          const from = this.getNodeParameter('from', i, 0) as number;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getConfirmedTokens',
            params: [from, limit],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }
        
        case 'callTokenContract': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i, '') as string;
          const blockNumber = this.getNodeParameter('blockNumber', i, 'latest') as string;
          
          const transaction: any = {
            to: to,
          };
          
          if (data) {
            transaction.data = data;
          }
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [transaction, blockNumber],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
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

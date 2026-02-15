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
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'unknown',
            value: 'unknown',
          },
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Contracts',
            value: 'contracts',
          },
          {
            name: 'Logs',
            value: 'logs',
          },
          {
            name: 'Network',
            value: 'network',
          },
          {
            name: 'Bridging',
            value: 'bridging',
          },
          {
            name: 'Proofs',
            value: 'proofs',
          }
        ],
        default: 'blocks',
      },
      // Operation dropdowns per resource
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
      name: 'Get Latest Block Number',
      value: 'getLatestBlockNumber',
      description: 'Get the latest block number',
      action: 'Get latest block number',
    },
    {
      name: 'Get zkSync Block Details',
      value: 'getZkSyncBlockDetails',
      description: 'Get zkSync-specific block details',
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
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get ETH Balance',
      value: 'getEthBalance',
      description: 'Get ETH balance of an account',
      action: 'Get ETH balance',
    },
    {
      name: 'Get Contract Code',
      value: 'getCode',
      description: 'Get contract code at an address',
      action: 'Get contract code',
    },
    {
      name: 'Get Storage Value',
      value: 'getStorageAt',
      description: 'Get storage value at a specific position',
      action: 'Get storage value',
    },
    {
      name: 'Get Token Balance',
      value: 'getTokenBalance',
      description: 'Get token balance using zkSync-specific method',
      action: 'Get token balance',
    },
  ],
  default: 'getEthBalance',
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
      name: 'Execute Contract Call',
      value: 'ethCall',
      description: 'Execute a contract call',
      action: 'Execute contract call',
    },
    {
      name: 'Estimate Gas',
      value: 'estimateGas',
      description: 'Estimate gas for transaction',
      action: 'Estimate gas for transaction',
    },
    {
      name: 'Estimate zkSync Fee',
      value: 'estimateFee',
      description: 'Estimate zkSync fee for transaction',
      action: 'Estimate zkSync fee',
    },
    {
      name: 'Get All Account Balances',
      value: 'getAllAccountBalances',
      description: 'Get all token balances for an account',
      action: 'Get all account balances',
    },
  ],
  default: 'ethCall',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['logs'],
    },
  },
  options: [
    {
      name: 'Get Logs',
      value: 'getLogs',
      description: 'Get filtered event logs',
      action: 'Get filtered event logs',
    },
    {
      name: 'Create Filter',
      value: 'createFilter',
      description: 'Create a new log filter',
      action: 'Create log filter',
    },
    {
      name: 'Get Filter Changes',
      value: 'getFilterChanges',
      description: 'Get changes for an existing filter',
      action: 'Get filter changes',
    },
    {
      name: 'Remove Filter',
      value: 'removeFilter',
      description: 'Remove an existing filter',
      action: 'Remove filter',
    },
  ],
  default: 'getLogs',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['network'],
    },
  },
  options: [
    {
      name: 'Get Chain ID',
      value: 'getChainId',
      description: 'Get the chain ID of the network',
      action: 'Get chain ID',
    },
    {
      name: 'Get Gas Price',
      value: 'getGasPrice',
      description: 'Get the current gas price',
      action: 'Get gas price',
    },
    {
      name: 'Get Network Version',
      value: 'getNetworkVersion',
      description: 'Get the network version',
      action: 'Get network version',
    },
    {
      name: 'Get Main Contract',
      value: 'getMainContract',
      description: 'Get the main contract address',
      action: 'Get main contract address',
    },
  ],
  default: 'getChainId',
},
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
      name: 'Get L1 Batch Number',
      value: 'getL1BatchNumber',
      description: 'Get the current L1 batch number',
      action: 'Get L1 batch number',
    },
    {
      name: 'Get L1 Batch Details',
      value: 'getL1BatchDetails',
      description: 'Get details of a specific L1 batch',
      action: 'Get L1 batch details',
    },
    {
      name: 'Get Bridgehub Contract',
      value: 'getBridgehubContract',
      description: 'Get the bridgehub contract address',
      action: 'Get bridgehub contract',
    },
    {
      name: 'Get Base Token L1 Address',
      value: 'getBaseTokenL1Address',
      description: 'Get the base token L1 address',
      action: 'Get base token L1 address',
    },
  ],
  default: 'getL1BatchNumber',
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
      name: 'Get Merkle Proof',
      value: 'getProof',
      description: 'Get Merkle proof for account and storage keys',
      action: 'Get Merkle proof',
    },
    {
      name: 'Get Bytecode By Hash',
      value: 'getBytecodeByHash',
      description: 'Get contract bytecode by bytecode hash',
      action: 'Get contract bytecode',
    },
    {
      name: 'Get L2 To L1 Message Proof',
      value: 'getL2ToL1MsgProof',
      description: 'Get proof for L2 to L1 message',
      action: 'Get L2 to L1 message proof',
    },
  ],
  default: 'getProof',
},
      // Parameter definitions
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByNumber', 'getZkSyncBlockDetails'],
    },
  },
  default: 'latest',
  description: 'The block number to retrieve (can be hex number, decimal number, or "latest", "earliest", "pending")',
  placeholder: 'latest',
},
{
  displayName: 'Include Transactions',
  name: 'includeTransactions',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByNumber', 'getBlockByHash'],
    },
  },
  default: false,
  description: 'Whether to include full transaction objects in the block data',
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
  description: 'The block hash to retrieve',
  placeholder: '0x...',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getEthBalance', 'getCode', 'getStorageAt', 'getTokenBalance'],
    },
  },
  default: '',
  description: 'The account or contract address',
  placeholder: '0x742d35cc6634c0532925a3b8d431d3c30895ce0',
},
{
  displayName: 'Block Tag',
  name: 'blockTag',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getEthBalance', 'getCode', 'getStorageAt', 'getTokenBalance'],
    },
  },
  default: 'latest',
  description: 'Block tag (latest, earliest, pending, or block number in hex)',
  placeholder: 'latest',
},
{
  displayName: 'Storage Position',
  name: 'position',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getStorageAt'],
    },
  },
  default: '',
  description: 'Storage position (hex encoded)',
  placeholder: '0x0',
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getTokenBalance'],
    },
  },
  default: '',
  description: 'Token contract address',
  placeholder: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
},
{
  displayName: 'Contract Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['ethCall', 'estimateGas', 'estimateFee'],
    },
  },
  default: '',
  description: 'The contract address to call',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['ethCall', 'estimateGas', 'estimateFee'],
    },
  },
  default: '',
  description: 'The encoded function call data',
},
{
  displayName: 'From Address',
  name: 'from',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['ethCall', 'estimateGas', 'estimateFee'],
    },
  },
  default: '',
  description: 'The address the transaction is sent from',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['ethCall', 'estimateGas', 'estimateFee'],
    },
  },
  default: '0x0',
  description: 'The value sent with this transaction in hex',
},
{
  displayName: 'Gas',
  name: 'gas',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['ethCall', 'estimateGas', 'estimateFee'],
    },
  },
  default: '',
  description: 'The gas limit in hex',
},
{
  displayName: 'Gas Price',
  name: 'gasPrice',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['ethCall', 'estimateGas', 'estimateFee'],
    },
  },
  default: '',
  description: 'The gas price in hex',
},
{
  displayName: 'Block Tag',
  name: 'blockTag',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['ethCall'],
    },
  },
  options: [
    {
      name: 'Latest',
      value: 'latest',
    },
    {
      name: 'Earliest',
      value: 'earliest',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Finalized',
      value: 'finalized',
    },
    {
      name: 'Safe',
      value: 'safe',
    },
  ],
  default: 'latest',
  description: 'The block tag to use for the call',
},
{
  displayName: 'Account Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contracts'],
      operation: ['getAllAccountBalances'],
    },
  },
  default: '',
  description: 'The account address to get balances for',
},
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['logs'],
      operation: ['getLogs', 'createFilter'],
    },
  },
  default: 'latest',
  description: 'Block number to start filtering from (hex string, "earliest", "latest", "pending")',
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['logs'],
      operation: ['getLogs', 'createFilter'],
    },
  },
  default: 'latest',
  description: 'Block number to filter to (hex string, "earliest", "latest", "pending")',
},
{
  displayName: 'Contract Address',
  name: 'address',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['logs'],
      operation: ['getLogs', 'createFilter'],
    },
  },
  default: '',
  description: 'Contract address to filter logs from (optional)',
},
{
  displayName: 'Topics',
  name: 'topics',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['logs'],
      operation: ['getLogs', 'createFilter'],
    },
  },
  default: '[]',
  description: 'Array of topics to filter by (JSON array)',
},
{
  displayName: 'Block Hash',
  name: 'blockHash',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['logs'],
      operation: ['getLogs', 'createFilter'],
    },
  },
  default: '',
  description: 'Block hash to filter from (optional, mutually exclusive with fromBlock/toBlock)',
},
{
  displayName: 'Filter ID',
  name: 'filterId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['logs'],
      operation: ['getFilterChanges', 'removeFilter'],
    },
  },
  default: '',
  description: 'The filter ID to query or remove',
},
{
  displayName: 'Batch Number',
  name: 'batchNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['bridging'],
      operation: ['getL1BatchDetails'],
    },
  },
  default: '',
  description: 'The L1 batch number to get details for (as hex string, e.g., 0x1a2b)',
  placeholder: '0x1a2b',
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
},
{
  displayName: 'Storage Keys',
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
  description: 'Comma-separated list of storage keys in hexadecimal format',
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
  default: '',
  description: 'L1 batch number in hexadecimal format',
},
{
  displayName: 'Bytecode Hash',
  name: 'bytecodeHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getBytecodeByHash'],
    },
  },
  default: '',
  description: 'The bytecode hash to retrieve',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getL2ToL1MsgProof'],
    },
  },
  default: '',
  description: 'Block number in hexadecimal format',
},
{
  displayName: 'Sender',
  name: 'sender',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getL2ToL1MsgProof'],
    },
  },
  default: '',
  description: 'The sender address of the message',
},
{
  displayName: 'Message',
  name: 'msg',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getL2ToL1MsgProof'],
    },
  },
  default: '',
  description: 'The message data in hexadecimal format',
},
{
  displayName: 'L2 Transaction Number In Block',
  name: 'l2TxNumberInBlock',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['proofs'],
      operation: ['getL2ToL1MsgProof'],
    },
  },
  default: '',
  description: 'L2 transaction number in block (optional)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'unknown':
        return [await executeunknownOperations.call(this, items)];
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'contracts':
        return [await executeContractsOperations.call(this, items)];
      case 'logs':
        return [await executeLogsOperations.call(this, items)];
      case 'network':
        return [await executeNetworkOperations.call(this, items)];
      case 'bridging':
        return [await executeBridgingOperations.call(this, items)];
      case 'proofs':
        return [await executeProofsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

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
          const includeTransactions = this.getNodeParameter('includeTransactions', i) as boolean;
          
          const formattedBlockNumber = formatBlockNumber(blockNumber);
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [formattedBlockNumber, includeTransactions],
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
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `zkSync Era API Error: ${parsedResponse.error.message}`,
            });
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getBlockByHash': {
          const blockHash = this.getNodeParameter('blockHash', i) as string;
          const includeTransactions = this.getNodeParameter('includeTransactions', i) as boolean;
          
          if (!blockHash.startsWith('0x')) {
            throw new NodeOperationError(this.getNode(), 'Block hash must start with 0x');
          }
          
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
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `zkSync Era API Error: ${parsedResponse.error.message}`,
            });
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getLatestBlockNumber': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
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
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `zkSync Era API Error: ${parsedResponse.error.message}`,
            });
          }
          
          result = {
            blockNumber: parsedResponse.result,
            blockNumberDecimal: parseInt(parsedResponse.result, 16),
          };
          break;
        }

        case 'getZkSyncBlockDetails': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const formattedBlockNumber = formatBlockNumber(blockNumber);
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getBlockDetails',
            params: [formattedBlockNumber],
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
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `zkSync Era API Error: ${parsedResponse.error.message}`,
            });
          }
          
          result = parsedResponse.result;
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

function formatBlockNumber(blockNumber: string): string {
  if (blockNumber === 'latest' || blockNumber === 'earliest' || blockNumber === 'pending') {
    return blockNumber;
  }
  
  if (blockNumber.startsWith('0x')) {
    return blockNumber;
  }
  
  const numericValue = parseInt(blockNumber, 10);
  if (isNaN(numericValue)) {
    throw new Error('Invalid block number format');
  }
  
  return '0x' + numericValue.toString(16);
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
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'Send Raw Transaction',
      value: 'sendRawTransaction',
      desc

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
      const blockTag = this.getNodeParameter('blockTag', i, 'latest') as string;

      const baseOptions = {
        method: 'POST',
        url: credentials.baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };

      switch (operation) {
        case 'getEthBalance': {
          const options: any = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [address, blockTag],
              id: 1,
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          if (result.error) {
            throw new NodeApiError(this.getNode(), result, { 
              message: result.error.message,
              httpCode: '400'
            });
          }
          result = result.result;
          break;
        }
        case 'getCode': {
          const options: any = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              method: 'eth_getCode',
              params: [address, blockTag],
              id: 1,
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          if (result.error) {
            throw new NodeApiError(this.getNode(), result, { 
              message: result.error.message,
              httpCode: '400'
            });
          }
          result = result.result;
          break;
        }
        case 'getStorageAt': {
          const position = this.getNodeParameter('position', i) as string;
          const options: any = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              method: 'eth_getStorageAt',
              params: [address, position, blockTag],
              id: 1,
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          if (result.error) {
            throw new NodeApiError(this.getNode(), result, { 
              message: result.error.message,
              httpCode: '400'
            });
          }
          result = result.result;
          break;
        }
        case 'getTokenBalance': {
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
          const options: any = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              method: 'zks_getBalance',
              params: [address, blockTag, tokenAddress],
              id: 1,
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          if (result.error) {
            throw new NodeApiError(this.getNode(), result, { 
              message: result.error.message,
              httpCode: '400'
            });
          }
          result = result.result;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: { 
          address,
          blockTag,
          operation,
          result
        }, 
        pairedItem: { item: i } 
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { 
            error: error.message,
            address: this.getNodeParameter('address', i, '') as string,
            operation
          }, 
          pairedItem: { item: i } 
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
        case 'ethCall': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          const gas = this.getNodeParameter('gas', i) as string;
          const gasPrice = this.getNodeParameter('gasPrice', i) as string;
          const blockTag = this.getNodeParameter('blockTag', i) as string;

          const transaction: any = {
            to,
            data,
          };

          if (from) transaction.from = from;
          if (value) transaction.value = value;
          if (gas) transaction.gas = gas;
          if (gasPrice) transaction.gasPrice = gasPrice;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [transaction, blockTag],
            id: i + 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': credentials.apiKey ? `Bearer ${credentials.apiKey}` : undefined,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, {
              message: `RPC Error: ${result.error.message}`,
            });
          }

          result = result.result;
          break;
        }

        case 'estimateGas': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          const gas = this.getNodeParameter('gas', i) as string;
          const gasPrice = this.getNodeParameter('gasPrice', i) as string;

          const transaction: any = {
            to,
            data,
          };

          if (from) transaction.from = from;
          if (value) transaction.value = value;
          if (gas) transaction.gas = gas;
          if (gasPrice) transaction.gasPrice = gasPrice;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [transaction],
            id: i + 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': credentials.apiKey ? `Bearer ${credentials.apiKey}` : undefined,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, {
              message: `RPC Error: ${result.error.message}`,
            });
          }

          result = result.result;
          break;
        }

        case 'estimateFee': {
          const to = this.getNodeParameter('to', i) as string;
          const data = this.getNodeParameter('data', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          const gas = this.getNodeParameter('gas', i) as string;
          const gasPrice = this.getNodeParameter('gasPrice', i) as string;

          const transaction: any = {
            to,
            data,
          };

          if (from) transaction.from = from;
          if (value) transaction.value = value;
          if (gas) transaction.gas = gas;
          if (gasPrice) transaction.gasPrice = gasPrice;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_estimateFee',
            params: [transaction],
            id: i + 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': credentials.apiKey ? `Bearer ${credentials.apiKey}` : undefined,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, {
              message: `RPC Error: ${result.error.message}`,
            });
          }

          result = result.result;
          break;
        }

        case 'getAllAccountBalances': {
          const address = this.getNodeParameter('address', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getAllAccountBalances',
            params: [address],
            id: i + 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': credentials.apiKey ? `Bearer ${credentials.apiKey}` : undefined,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, {
              message: `RPC Error: ${result.error.message}`,
            });
          }

          result = result.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
            itemIndex: i,
          });
      }

      returnData.push({
        json: result,
        pairedItem: {
          item: i,
        },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: {
            error: error.message,
          },
          pairedItem: {
            item: i,
          },
        });
        continue;
      }
      throw error;
    }
  }

  return returnData;
}

async function executeLogsOperations(
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
        case 'getLogs': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const topics = this.getNodeParameter('topics', i) as string;
          const blockHash = this.getNodeParameter('blockHash', i) as string;

          const filterObject: any = {};
          
          if (blockHash) {
            filterObject.blockHash = blockHash;
          } else {
            filterObject.fromBlock = fromBlock;
            filterObject.toBlock = toBlock;
          }

          if (address) {
            filterObject.address = address;
          }

          if (topics) {
            try {
              filterObject.topics = JSON.parse(topics);
            } catch (parseError: any) {
              throw new NodeOperationError(this.getNode(), `Invalid topics JSON: ${parseError.message}`);
            }
          }

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'eth_getLogs',
              params: [filterObject],
              id: 1,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { httpCode: '400' });
          }
          
          result = result.result;
          break;
        }

        case 'createFilter': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const topics = this.getNodeParameter('topics', i) as string;
          const blockHash = this.getNodeParameter('blockHash', i) as string;

          const filterObject: any = {};
          
          if (blockHash) {
            filterObject.blockHash = blockHash;
          } else {
            filterObject.fromBlock = fromBlock;
            filterObject.toBlock = toBlock;
          }

          if (address) {
            filterObject.address = address;
          }

          if (topics) {
            try {
              filterObject.topics = JSON.parse(topics);
            } catch (parseError: any) {
              throw new NodeOperationError(this.getNode(), `Invalid topics JSON: ${parseError.message}`);
            }
          }

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'eth_newFilter',
              params: [filterObject],
              id: 1,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { httpCode: '400' });
          }
          
          result = { filterId: result.result };
          break;
        }

        case 'getFilterChanges': {
          const filterId = this.getNodeParameter('filterId', i) as string;

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'eth_getFilterChanges',
              params: [filterId],
              id: 1,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { httpCode: '400' });
          }
          
          result = result.result;
          break;
        }

        case 'removeFilter': {
          const filterId = this.getNodeParameter('filterId', i) as string;

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              jsonrpc: '2.0',
              method: 'eth_uninstallFilter',
              params: [filterId],
              id: 1,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { httpCode: '400' });
          }
          
          result = { success: result.result, filterId };
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

async function executeNetworkOperations(
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
        case 'getChainId': {
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_chainId',
              params: [],
              id: 1,
            }),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGasPrice': {
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_gasPrice',
              params: [],
              id: 1,
            }),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNetworkVersion': {
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'net_version',
              params: [],
              id: 1,
            }),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMainContract': {
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'zks_getMainContract',
              params: [],
              id: 1,
            }),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error, {
          message: `zkSync Era API Error: ${result.error.message}`,
        });
      }

      returnData.push({ 
        json: {
          operation,
          result: result.result,
          rawResponse: result,
        }, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { 
            error: error.message,
            operation,
          }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBridgingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zksynceraApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      let rpcMethod: string;
      let params: any[] = [];

      switch (operation) {
        case 'getL1BatchNumber': {
          rpcMethod = 'zks_getL1BatchNumber';
          params = [];
          break;
        }
        case 'getL1BatchDetails': {
          const batchNumber = this.getNodeParameter('batchNumber', i) as string;
          rpcMethod = 'zks_getL1BatchDetails';
          params = [batchNumber];
          break;
        }
        case 'getBridgehubContract': {
          rpcMethod = 'zks_getBridgehubContract';
          params = [];
          break;
        }
        case 'getBaseTokenL1Address': {
          rpcMethod = 'zks_getBaseTokenL1Address';
          params = [];
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      const requestBody = {
        jsonrpc: '2.0',
        method: rpcMethod,
        params: params,
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
      const jsonResponse = JSON.parse(response);

      if (jsonResponse.error) {
        throw new NodeApiError(this.getNode(), {
          message: `RPC Error: ${jsonResponse.error.message}`,
          code: jsonResponse.error.code,
        });
      }

      result = {
        method: rpcMethod,
        params: params,
        result: jsonResponse.result,
        operation: operation,
      };

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message, operation: operation }, 
          pairedItem: { item: i } 
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
          
          const keys = keysParam.split(',').map((key: string) => key.trim());
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getProof',
            params: [address, keys, l1BatchNumber],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
          break;
        }

        case 'getBytecodeByHash': {
          const bytecodeHash = this.getNodeParameter('bytecodeHash', i) as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getBytecodeByHash',
            params: [bytecodeHash],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
          break;
        }

        case 'getL2ToL1MsgProof': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const sender = this.getNodeParameter('sender', i) as string;
          const msg = this.getNodeParameter('msg', i) as string;
          const l2TxNumberInBlock = this.getNodeParameter('l2TxNumberInBlock', i) as string;
          
          const params = [blockNumber, sender, msg];
          if (l2TxNumberInBlock) {
            params.push(l2TxNumberInBlock);
          }
          
          const requestBody = {
            jsonrpc: '2.0',
            method: 'zks_getL2ToL1MsgProof',
            params: params,
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
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

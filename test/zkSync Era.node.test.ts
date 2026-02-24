/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { zkSyncEra } from '../nodes/zkSync Era/zkSync Era.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('zkSyncEra Node', () => {
  let node: zkSyncEra;

  beforeAll(() => {
    node = new zkSyncEra();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('zkSync Era');
      expect(node.description.name).toBe('zksyncera');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getBalance operation', () => {
    it('should successfully get account balance', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBalance';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'blockNumber': return 'latest';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: '0x1bc16d674ec80000',
      });

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.address).toBe('0x1234567890123456789012345678901234567890');
      expect(result[0].json.balance).toBe('0x1bc16d674ec80000');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://mainnet.era.zksync.io',
        headers: { 'Content-Type': 'application/json' },
        body: {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: ['0x1234567890123456789012345678901234567890', 'latest'],
        },
        json: true,
      });
    });

    it('should handle API errors for getBalance', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBalance';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'blockNumber': return 'latest';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        error: { code: -32602, message: 'Invalid params' },
      });

      await expect(executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('zkSync Era API Error: Invalid params');
    });
  });

  describe('getAccountDetails operation', () => {
    it('should successfully get account details', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAccountDetails';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'blockNumber': return 'latest';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: { nonce: 5, verification: 'verified' },
      });

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.accountDetails).toEqual({ nonce: 5, verification: 'verified' });
    });
  });

  describe('getTransactionCount operation', () => {
    it('should successfully get transaction count', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getTransactionCount';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'blockNumber': return 'latest';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: '0x5',
      });

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.nonce).toBe('0x5');
      expect(result[0].json.nonceDecimal).toBe('5');
    });
  });

  describe('getAllAccountBalances operation', () => {
    it('should successfully get all account balances', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAllAccountBalances';
          case 'address': return '0x1234567890123456789012345678901234567890';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: {
          '0x0000000000000000000000000000000000000000': '0x1bc16d674ec80000',
          '0x1111111111111111111111111111111111111111': '0x56bc75e2d630eb20',
        },
      });

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.tokenCount).toBe(2);
      expect(result[0].json.balances).toHaveProperty('0x0000000000000000000000000000000000000000');
    });
  });

  describe('error handling', () => {
    it('should handle invalid address format', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBalance';
          case 'address': return 'invalid-address';
          case 'blockNumber': return 'latest';
          default: return undefined;
        }
      });

      await expect(executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid address format');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBalance';
          case 'address': return 'invalid-address';
          case 'blockNumber': return 'latest';
          default: return undefined;
        }
      });

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toContain('Invalid address format');
    });
  });
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('sendRawTransaction', () => {
    it('should send raw transaction successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x1234567890abcdef'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'sendRawTransaction';
        if (param === 'signedTransaction') return '0xabcdef123456';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe('0x1234567890abcdef');
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32000, message: 'Transaction failed' }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'sendRawTransaction';
        if (param === 'signedTransaction') return '0xabcdef123456';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      await expect(
        executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('getTransactionByHash', () => {
    it('should get transaction by hash successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: {
          hash: '0x123',
          blockNumber: '0x1',
          from: '0xabc',
          to: '0xdef',
          value: '0x0'
        }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTransactionByHash';
        if (param === 'transactionHash') return '0x123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.hash).toBe('0x123');
    });
  });

  describe('estimateFee', () => {
    it('should estimate fee successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: {
          gas_limit: '0x5208',
          gas_per_pubdata_limit: '0x320',
          max_fee_per_gas: '0x12a05f200',
          max_priority_fee_per_gas: '0x0'
        }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'estimateFee';
        if (param === 'transaction') return { from: '0xabc', to: '0xdef', value: '0x0' };
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.gas_limit).toBe('0x5208');
    });
  });

  describe('call', () => {
    it('should execute contract call successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x000000000000000000000000000000000000000000000000000000000000002a'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'call';
        if (param === 'transaction') return { to: '0xabc', data: '0x123' };
        if (param === 'blockNumber') return 'latest';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe('0x000000000000000000000000000000000000000000000000000000000000002a');
    });
  });
});

describe('Blocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get block by number successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: {
        number: '0x1b4',
        hash: '0x1234567890abcdef',
        parentHash: '0xabcdef1234567890',
        timestamp: '0x55ba467c',
        transactions: [],
      },
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockByNumber';
      if (paramName === 'blockNumber') return 'latest';
      if (paramName === 'includeTransactions') return false;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.number).toBe('0x1b4');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
      }),
      json: false,
    });
  });

  test('should get block by hash successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: {
        number: '0x1b4',
        hash: '0x1234567890abcdef',
        parentHash: '0xabcdef1234567890',
        timestamp: '0x55ba467c',
        transactions: [],
      },
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockByHash';
      if (paramName === 'blockHash') return '0x1234567890abcdef';
      if (paramName === 'includeTransactions') return true;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.hash).toBe('0x1234567890abcdef');
  });

  test('should get L1 batch number successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: '0x123',
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getL1BatchNumber';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('0x123');
  });

  test('should get L1 batch details successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: {
        number: '0x123',
        timestamp: '0x55ba467c',
        l1TxCount: 10,
        l2TxCount: 25,
      },
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getL1BatchDetails';
      if (paramName === 'batchNumber') return '0x123';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.number).toBe('0x123');
  });

  test('should get block details successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: {
        number: '0x1b4',
        hash: '0x1234567890abcdef',
        l1BatchNumber: '0x123',
        status: 'verified',
      },
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockDetails';
      if (paramName === 'blockNumber') return '436';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.status).toBe('verified');
  });

  test('should handle API errors', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32602,
        message: 'Invalid params',
      },
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockByNumber';
      if (paramName === 'blockNumber') return 'invalid';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    
    await expect(
      executeBlocksOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow();
  });

  test('should handle unknown operations', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'unknownOperation';
      return undefined;
    });

    const items = [{ json: {} }];
    
    await expect(
      executeBlocksOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Paymasters Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('estimateFee operation', () => {
    it('should estimate fee with paymaster successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: {
          gas_limit: '0x5208',
          max_fee_per_gas: '0x9502f9000',
          max_priority_fee_per_gas: '0x9502f9000',
          gas_per_pubdata_limit: '0x320',
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'estimateFee';
        if (paramName === 'transaction') return '{"to": "0x1234567890123456789012345678901234567890", "value": "0x0"}';
        if (paramName === 'paymasterAddress') return '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        if (paramName === 'paymasterInput') return '0x';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymastersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        gas_limit: '0x5208',
        max_fee_per_gas: '0x9502f9000',
        max_priority_fee_per_gas: '0x9502f9000',
        gas_per_pubdata_limit: '0x320',
      });
    });

    it('should handle estimate fee error', async () => {
      const mockErrorResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32602, message: 'Invalid params' },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'estimateFee';
        if (paramName === 'transaction') return '{"to": "invalid"}';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePaymastersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBeDefined();
    });
  });

  describe('sendTransaction operation', () => {
    it('should send paymaster transaction successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'sendTransaction';
        if (paramName === 'signedTransaction') return '0xf86c808504a817c800825208941234567890123456789012345678901234567890880de0b6b3a764000080';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymastersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    });
  });

  describe('getTokenPrice operation', () => {
    it('should get token price successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: '0x16345785d8a0000',
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenPrice';
        if (paramName === 'tokenAddress') return '0x1234567890123456789012345678901234567890';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymastersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe('0x16345785d8a0000');
    });
  });
});

describe('Proofs Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getProof operation', () => {
    it('should successfully get Merkle proof', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          address: '0x1234567890123456789012345678901234567890',
          storageProof: [
            {
              key: '0x1',
              value: '0x0',
              index: 1,
              proof: ['0xproof1', '0xproof2']
            }
          ]
        },
        id: 1
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getProof';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'keys': return '0x1,0x2';
          case 'l1BatchNumber': return 'latest';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProofsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        address: '0x1234567890123456789012345678901234567890',
        storageProof: [
          {
            key: '0x1',
            value: '0x0',
            index: 1,
            proof: ['0xproof1', '0xproof2']
          }
        ]
      });
    });

    it('should handle API error for getProof', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32602, message: 'Invalid params' },
        id: 1
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getProof';
          case 'address': return 'invalid-address';
          case 'keys': return '0x1';
          case 'l1BatchNumber': return 'latest';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      await expect(
        executeProofsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('getL1BatchDetails operation', () => {
    it('should successfully get L1 batch details', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          number: 123,
          timestamp: 1234567890,
          l1TxCount: 5,
          l2TxCount: 10,
          rootHash: '0xrootHash',
          status: 'verified',
          commitTxHash: '0xcommitTx',
          proveTxHash: '0xproveTx',
          executeTxHash: '0xexecuteTx'
        },
        id: 1
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getL1BatchDetails';
          case 'batchNumber': return 123;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProofsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.number).toBe(123);
      expect(result[0].json.status).toBe('verified');
    });
  });

  describe('getL2ToL1LogProof operation', () => {
    it('should successfully get L2 to L1 log proof', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          proof: ['0xproof1', '0xproof2', '0xproof3'],
          id: 1,
          root: '0xroot'
        },
        id: 1
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        switch (param) {
          case 'operation': return 'getL2ToL1LogProof';
          case 'txHash': return '0x1234567890123456789012345678901234567890123456789012345678901234';
          case 'logIndex': return defaultValue || 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProofsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.proof).toHaveLength(3);
      expect(result[0].json.root).toBe('0xroot');
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

      await expect(
        executeProofsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getProof');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

      const result = await executeProofsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network error');
    });
  });
});

describe('Contracts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should call contract function successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: '0x1234567890abcdef',
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'callFunction';
      if (param === 'transaction') return { to: '0x1234', data: '0xabcd' };
      if (param === 'blockNumber') return 'latest';
      return defaultValue;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual('0x1234567890abcdef');
  });

  test('should get contract details successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        createdAtBlock: 123456,
        createdAtTx: '0xabc123',
        creator: '0x456def',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDetails';
      if (param === 'contractAddress') return '0x1234567890abcdef';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.createdAtBlock).toEqual(123456);
  });

  test('should get contract code successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: '0x608060405234801561001057600080fd5b50',
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'getCode';
      if (param === 'address') return '0x1234567890abcdef';
      if (param === 'blockNumber') return 'latest';
      return defaultValue;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual('0x608060405234801561001057600080fd5b50');
  });

  test('should get bytecode by hash successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: '0x608060405234801561001057600080fd5b50',
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBytecodeByHash';
      if (param === 'bytecodeHash') return '0xabc123def456';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual('0x608060405234801561001057600080fd5b50');
  });

  test('should handle API errors', async () => {
    const mockErrorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Invalid address',
        data: 'Address format is incorrect',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getCode';
      if (param === 'address') return 'invalid-address';
      return 'latest';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    await expect(
      executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('zkSync Era API Error: Invalid address');
  });

  test('should handle unknown operation error', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return undefined;
    });

    await expect(
      executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Tokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get all account balances successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: {
        '0x0000000000000000000000000000000000000000': '1000000000000000000',
        '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4': '5000000000000000000',
      },
      id: 1,
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getAllAccountBalances';
      if (param === 'address') return '0x742d35Cc7F2c4C5D8C6c7C8C5c5c5c5c5c5c5c5c';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokensOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      '0x0000000000000000000000000000000000000000': '1000000000000000000',
      '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4': '5000000000000000000',
    });
  });

  test('should get token price successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: '2500000000000000000',
      id: 1,
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTokenPrice';
      if (param === 'tokenAddress') return '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokensOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('2500000000000000000');
  });

  test('should get confirmed tokens successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: [
        {
          l1Address: '0x0000000000000000000000000000000000000000',
          l2Address: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          name: 'Ethereum',
        },
        {
          l1Address: '0xA0b86a33E6441c8C85007dEb2a0F3D9dE4b1c2E3',
          l2Address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
          symbol: 'USDC',
          name: 'USD Coin',
        },
      ],
      id: 1,
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'getConfirmedTokens';
      if (param === 'from') return defaultValue || 0;
      if (param === 'limit') return defaultValue || 100;
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokensOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveLength(2);
    expect(result[0].json[0].symbol).toBe('ETH');
    expect(result[0].json[1].symbol).toBe('USDC');
  });

  test('should call token contract successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      id: 1,
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'callTokenContract';
      if (param === 'to') return '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4';
      if (param === 'data') return defaultValue || '0x70a08231000000000000000000000000742d35cc7f2c4c5d8c6c7c8c5c5c5c5c5c5c5c5c';
      if (param === 'blockNumber') return defaultValue || 'latest';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokensOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('0x0000000000000000000000000000000000000000000000000de0b6b3a7640000');
  });

  test('should handle API errors', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32602,
        message: 'Invalid params',
      },
      id: 1,
    });

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getAllAccountBalances';
      if (param === 'address') return 'invalid-address';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];

    await expect(executeTokensOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
  });

  test('should handle unknown operation error', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'unknownOperation';
      return null;
    });

    const items = [{ json: {} }];

    await expect(executeTokensOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});

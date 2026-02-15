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
describe('Blocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
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

  describe('getBlockByNumber', () => {
    it('should get block by number successfully', async () => {
      const mockBlockData = {
        number: '0x1234',
        hash: '0xabcd...',
        transactions: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getBlockByNumber';
          case 'blockNumber':
            return 'latest';
          case 'includeTransactions':
            return false;
          default:
            return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
        jsonrpc: '2.0',
        result: mockBlockData,
        id: 1,
      }));

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockBlockData);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://mainnet.era.zksync.io',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
          id: 1,
        }),
        json: false,
      });
    });

    it('should handle API error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getBlockByNumber';
          case 'blockNumber':
            return 'latest';
          case 'includeTransactions':
            return false;
          default:
            return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32602, message: 'Invalid params' },
        id: 1,
      }));

      await expect(executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('zkSync Era API Error');
    });
  });

  describe('getBlockByHash', () => {
    it('should get block by hash successfully', async () => {
      const mockBlockData = {
        number: '0x1234',
        hash: '0xabcd1234...',
        transactions: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getBlockByHash';
          case 'blockHash':
            return '0xabcd1234...';
          case 'includeTransactions':
            return true;
          default:
            return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
        jsonrpc: '2.0',
        result: mockBlockData,
        id: 1,
      }));

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockBlockData);
    });
  });

  describe('getLatestBlockNumber', () => {
    it('should get latest block number successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') {
          return 'getLatestBlockNumber';
        }
        return null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
        jsonrpc: '2.0',
        result: '0x1234',
        id: 1,
      }));

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        blockNumber: '0x1234',
        blockNumberDecimal: 4660,
      });
    });
  });

  describe('getZkSyncBlockDetails', () => {
    it('should get zkSync block details successfully', async () => {
      const mockZkSyncBlockData = {
        number: 4660,
        l1BatchNumber: 1000,
        timestamp: 1234567890,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getZkSyncBlockDetails';
          case 'blockNumber':
            return '4660';
          default:
            return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify({
        jsonrpc: '2.0',
        result: mockZkSyncBlockData,
        id: 1,
      }));

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockZkSyncBlockData);
    });
  });
});

describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
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

  test('should get ETH balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getEthBalance';
        case 'address':
          return '0x742d35cc6634c0532925a3b8d431d3c30895ce0';
        case 'blockTag':
          return 'latest';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x1b1ae4d6e2ef500000',
    });

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x1b1ae4d6e2ef500000');
    expect(result[0].json.operation).toBe('getEthBalance');
  });

  test('should get contract code successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getCode';
        case 'address':
          return '0x742d35cc6634c0532925a3b8d431d3c30895ce0';
        case 'blockTag':
          return 'latest';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x608060405234801561001057600080fd5b50',
    });

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x608060405234801561001057600080fd5b50');
    expect(result[0].json.operation).toBe('getCode');
  });

  test('should get storage value successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getStorageAt';
        case 'address':
          return '0x742d35cc6634c0532925a3b8d431d3c30895ce0';
        case 'position':
          return '0x0';
        case 'blockTag':
          return 'latest';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x000000000000000000000000000000000000000000000000000000000000002a',
    });

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x000000000000000000000000000000000000000000000000000000000000002a');
    expect(result[0].json.operation).toBe('getStorageAt');
  });

  test('should get token balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getTokenBalance';
        case 'address':
          return '0x742d35cc6634c0532925a3b8d431d3c30895ce0';
        case 'tokenAddress':
          return '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91';
        case 'blockTag':
          return 'latest';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x56bc75e2d630eb20',
    });

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x56bc75e2d630eb20');
    expect(result[0].json.operation).toBe('getTokenBalance');
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getEthBalance';
        case 'address':
          return 'invalid-address';
        case 'blockTag':
          return 'latest';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32602,
        message: 'Invalid address format',
      },
    });

    const items = [{ json: {} }];

    await expect(executeAccountsOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow('Invalid address format');
  });

  test('should handle unknown operations', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return '';
    });

    const items = [{ json: {} }];

    await expect(executeAccountsOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getEthBalance';
        case 'address':
          return 'invalid-address';
        case 'blockTag':
          return 'latest';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32602,
        message: 'Invalid address format',
      },
    });

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address format');
    expect(result[0].json.operation).toBe('getEthBalance');
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

  test('should execute contract call successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('ethCall')
      .mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
      .mockReturnValueOnce('0xa9059cbb')
      .mockReturnValueOnce('0xabcdef1234567890abcdef1234567890abcdef12')
      .mockReturnValueOnce('0x0')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('latest');

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x0000000000000000000000000000000000000000000000000000000000000001',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: '0x1234567890abcdef1234567890abcdef12345678',
            data: '0xa9059cbb',
            from: '0xabcdef1234567890abcdef1234567890abcdef12',
            value: '0x0',
          },
          'latest',
        ],
        id: 1,
      },
      json: true,
    });
  });

  test('should estimate gas successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('estimateGas')
      .mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
      .mockReturnValueOnce('0xa9059cbb')
      .mockReturnValueOnce('0xabcdef1234567890abcdef1234567890abcdef12')
      .mockReturnValueOnce('0x0')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x5208',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        jsonrpc: '2.0',
        method: 'eth_estimateGas',
        params: [
          {
            to: '0x1234567890abcdef1234567890abcdef12345678',
            data: '0xa9059cbb',
            from: '0xabcdef1234567890abcdef1234567890abcdef12',
            value: '0x0',
          },
        ],
        id: 1,
      },
      json: true,
    });
  });

  test('should get all account balances successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllAccountBalances')
      .mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678');

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        '0x0000000000000000000000000000000000000000': '0x56bc75e2d630eb20',
        '0x1234567890abcdef1234567890abcdef12345678': '0xde0b6b3a7640000',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        jsonrpc: '2.0',
        method: 'zks_getAllAccountBalances',
        params: ['0x1234567890abcdef1234567890abcdef12345678'],
        id: 1,
      },
      json: true,
    });
  });

  test('should handle RPC errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('ethCall')
      .mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
      .mockReturnValueOnce('0xa9059cbb')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('0x0')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('latest');

    const mockErrorResponse = {
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32000,
        message: 'execution reverted',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    await expect(
      executeContractsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('RPC Error: execution reverted');
  });
});

describe('Logs Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
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

  test('should get logs successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getLogs',
        fromBlock: 'latest',
        toBlock: 'latest',
        address: '0x1234567890abcdef',
        topics: '[]',
        blockHash: '',
      };
      return params[param];
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: [
        {
          address: '0x1234567890abcdef',
          topics: ['0xabcd'],
          data: '0x1234',
          blockNumber: '0x1',
          transactionHash: '0x5678',
          transactionIndex: '0x0',
          blockHash: '0x9abc',
          logIndex: '0x0',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: { 'Content-Type': 'application/json' },
      body: {
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [{ fromBlock: 'latest', toBlock: 'latest', address: '0x1234567890abcdef', topics: [] }],
        id: 1,
      },
      json: true,
    });
  });

  test('should create filter successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'createFilter',
        fromBlock: '0x1',
        toBlock: '0x2',
        address: '0x1234567890abcdef',
        topics: '["0xabcd"]',
        blockHash: '',
      };
      return params[param];
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: '0x1',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ filterId: '0x1' });
  });

  test('should get filter changes successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getFilterChanges',
        filterId: '0x1',
      };
      return params[param];
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: [
        {
          address: '0x1234567890abcdef',
          topics: ['0xabcd'],
          data: '0x1234',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should remove filter successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'removeFilter',
        filterId: '0x1',
      };
      return params[param];
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: true,
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ success: true, filterId: '0x1' });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getLogs',
        fromBlock: 'latest',
        toBlock: 'latest',
        address: '',
        topics: '[]',
        blockHash: '',
      };
      return params[param];
    });

    const mockErrorResponse = {
      jsonrpc: '2.0',
      id: 1,
      error: { code: -32602, message: 'Invalid params' },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    await expect(
      executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should handle invalid topics JSON', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getLogs',
        fromBlock: 'latest',
        toBlock: 'latest',
        address: '',
        topics: 'invalid json',
        blockHash: '',
      };
      return params[param];
    });

    await expect(
      executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Invalid topics JSON');
  });
});

describe('Network Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
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

  describe('getChainId', () => {
    it('should get chain ID successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChainId';
        return undefined;
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x144',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.operation).toBe('getChainId');
      expect(result[0].json.result).toBe('0x144');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://mainnet.era.zksync.io',
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
      });
    });

    it('should handle API error for chain ID', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChainId';
        return undefined;
      });

      const mockErrorResponse = {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32602,
          message: 'Invalid params',
        },
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      await expect(
        executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('getGasPrice', () => {
    it('should get gas price successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getGasPrice';
        return undefined;
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x2540be400',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.operation).toBe('getGasPrice');
      expect(result[0].json.result).toBe('0x2540be400');
    });
  });

  describe('getNetworkVersion', () => {
    it('should get network version successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getNetworkVersion';
        return undefined;
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '324',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.operation).toBe('getNetworkVersion');
      expect(result[0].json.result).toBe('324');
    });
  });

  describe('getMainContract', () => {
    it('should get main contract address successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getMainContract';
        return undefined;
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x32400084c286cf3e17e7b677ea9583e60a000324',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.operation).toBe('getMainContract');
      expect(result[0].json.result).toBe('0x32400084c286cf3e17e7b677ea9583e60a000324');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://mainnet.era.zksync.io',
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
      });
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'unknownOperation';
        return undefined;
      });

      await expect(
        executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChainId';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

      const result = await executeNetworkOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network error');
      expect(result[0].json.operation).toBe('getChainId');
    });
  });
});

describe('Bridging Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
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

  describe('getL1BatchNumber', () => {
    it('should get L1 batch number successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: '0x1a2b',
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getL1BatchNumber');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeBridgingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0x1a2b');
      expect(result[0].json.method).toBe('zks_getL1BatchNumber');
    });

    it('should handle RPC error', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Invalid request' },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getL1BatchNumber');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      
      await expect(
        executeBridgingOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('RPC Error: Invalid request');
    });
  });

  describe('getL1BatchDetails', () => {
    it('should get L1 batch details successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          number: '0x1a2b',
          timestamp: '0x64a1b2c3',
          l1GasPrice: '0x12a05f200',
          l2FairGasPrice: '0xbebc200',
        },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter
        .mockImplementation((param: string, index: number) => {
          if (param === 'operation') return 'getL1BatchDetails';
          if (param === 'batchNumber') return '0x1a2b';
          return '';
        });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeBridgingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.method).toBe('zks_getL1BatchDetails');
      expect(result[0].json.params).toEqual(['0x1a2b']);
      expect(result[0].json.result.number).toBe('0x1a2b');
    });
  });

  describe('getBridgehubContract', () => {
    it('should get bridgehub contract successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: '0x303a465B659cBB0ab36eE643eA362c509EEb5213',
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBridgehubContract');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeBridgingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0x303a465B659cBB0ab36eE643eA362c509EEb5213');
      expect(result[0].json.method).toBe('zks_getBridgehubContract');
    });
  });

  describe('getBaseTokenL1Address', () => {
    it('should get base token L1 address successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: '0x0000000000000000000000000000000000000000',
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBaseTokenL1Address');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeBridgingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0x0000000000000000000000000000000000000000');
      expect(result[0].json.method).toBe('zks_getBaseTokenL1Address');
    });
  });

  describe('error handling', () => {
    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getL1BatchNumber');
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

      const items = [{ json: {} }];
      const result = await executeBridgingOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network error');
      expect(result[0].json.operation).toBe('getL1BatchNumber');
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
        baseUrl: 'https://testnet.era.zksync.io',
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
    it('should get Merkle proof successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: {
          address: '0x1234567890123456789012345678901234567890',
          storageProof: [
            {
              key: '0x0000000000000000000000000000000000000000000000000000000000000000',
              proof: ['0xproof1', '0xproof2'],
              value: '0x0000000000000000000000000000000000000000000000000000000000000001',
            },
          ],
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getProof';
          case 'address':
            return '0x1234567890123456789012345678901234567890';
          case 'keys':
            return '0x0000000000000000000000000000000000000000000000000000000000000000';
          case 'l1BatchNumber':
            return '0x1';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeProofsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse.result);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://testnet.era.zksync.io',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'zks_getProof',
          params: [
            '0x1234567890123456789012345678901234567890',
            ['0x0000000000000000000000000000000000000000000000000000000000000000'],
            '0x1',
          ],
          id: 1,
        }),
      });
    });
  });

  describe('getBytecodeByHash operation', () => {
    it('should get bytecode by hash successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x608060405234801561001057600080fd5b50',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getBytecodeByHash';
          case 'bytecodeHash':
            return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeProofsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse.result);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://testnet.era.zksync.io',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'zks_getBytecodeByHash',
          params: ['0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'],
          id: 1,
        }),
      });
    });
  });

  describe('getL2ToL1MsgProof operation', () => {
    it('should get L2 to L1 message proof successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: {
          id: 1,
          proof: ['0xproof1', '0xproof2', '0xproof3'],
          root: '0xroot123456789',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getL2ToL1MsgProof';
          case 'blockNumber':
            return '0x1';
          case 'sender':
            return '0x1234567890123456789012345678901234567890';
          case 'msg':
            return '0xabcdef123456789';
          case 'l2TxNumberInBlock':
            return '0x0';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeProofsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse.result);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://testnet.era.zksync.io',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'zks_getL2ToL1MsgProof',
          params: ['0x1', '0x1234567890123456789012345678901234567890', '0xabcdef123456789', '0x0'],
          id: 1,
        }),
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const mockErrorResponse = {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32602,
          message: 'Invalid params',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getProof';
          case 'address':
            return 'invalid-address';
          case 'keys':
            return 'invalid-key';
          case 'l1BatchNumber':
            return 'invalid-batch';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      const items = [{ json: {} }];

      await expect(executeProofsOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getProof';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

      const items = [{ json: {} }];
      const result = await executeProofsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network error');
    });
  });
});
});

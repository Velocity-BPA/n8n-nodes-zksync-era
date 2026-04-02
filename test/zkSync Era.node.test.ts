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

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
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
describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://mainnet.era.zksync.io',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get account balance successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBalance')
			.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D238439C') 
			.mockReturnValueOnce('latest');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: '0x1bc16d674ec80000',
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x1bc16d674ec80000');
	});

	it('should get transaction count successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTransactionCount')
			.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D238439C')
			.mockReturnValueOnce('latest');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: '0x1',
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x1');
	});

	it('should get account code successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCode')
			.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D238439C')
			.mockReturnValueOnce('latest');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: '0x608060405234801561001057600080fd5b50',
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x608060405234801561001057600080fd5b50');
	});

	it('should get storage at position successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getStorageAt')
			.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D238439C')
			.mockReturnValueOnce('latest')
			.mockReturnValueOnce('0x0');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: '0x0000000000000000000000000000000000000000000000000000000000000000',
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
	});

	it('should get zkSync account details successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('zksGetAccount')
			.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D238439C')
			.mockReturnValueOnce('latest');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: {
				address: '0x742d35Cc6634C0532925a3b8D238439C',
				nonce: '0x1',
				balance: '0x1bc16d674ec80000',
			},
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.address).toBe('0x742d35Cc6634C0532925a3b8D238439C');
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBalance')
			.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D238439C')
			.mockReturnValueOnce('latest');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Transaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://mainnet.era.zksync.io',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should send transaction successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('sendTransaction')
			.mockReturnValueOnce({ to: '0x123', value: '1000000000000000000' });

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: '0xabc123',
		});

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { id: expect.any(Number), jsonrpc: '2.0', result: '0xabc123' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should send raw transaction successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('sendRawTransaction')
			.mockReturnValueOnce('0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a7640000801ca0123456');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: '0xdef456',
		});

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { id: expect.any(Number), jsonrpc: '2.0', result: '0xdef456' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should get transaction successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTransaction')
			.mockReturnValueOnce('0xabc123def456');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: { hash: '0xabc123def456', blockNumber: '0x1' },
		});

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { id: expect.any(Number), jsonrpc: '2.0', result: { hash: '0xabc123def456', blockNumber: '0x1' } },
			pairedItem: { item: 0 },
		}]);
	});

	it('should get transaction receipt successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTransactionReceipt')
			.mockReturnValueOnce('0xabc123def456');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 1,
			jsonrpc: '2.0',
			result: { transactionHash: '0xabc123def456', status: '0x1' },
		});

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { id: expect.any(Number), jsonrpc: '2.0', result: { transactionHash: '0xabc123def456', status: '0x1' } },
			pairedItem: { item: 0 },
		}]);
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

		const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'Network error' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

		await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]))
			.rejects.toThrow('Network error');
	});
});

describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://mainnet.era.zksync.io' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() },
    };
  });

  describe('getBlockNumber', () => {
    it('should get latest block number successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockNumber');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"id":1,"jsonrpc":"2.0","result":"0x1234"}');

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0x1234');
    });

    it('should handle errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockNumber');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getBlockByHash', () => {
    it('should get block by hash successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockByHash')
        .mockReturnValueOnce('0xabcd1234')
        .mockReturnValueOnce(true);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"id":1,"jsonrpc":"2.0","result":{"number":"0x1234"}}');

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.number).toBe('0x1234');
    });
  });

  describe('zksGetBlockDetails', () => {
    it('should get zkSync block details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('zksGetBlockDetails')
        .mockReturnValueOnce('latest');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"id":1,"jsonrpc":"2.0","result":{"status":"verified"}}');

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.status).toBe('verified');
    });
  });

  describe('zksGetL1BatchDetails', () => {
    it('should get L1 batch details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('zksGetL1BatchDetails')
        .mockReturnValueOnce(100);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"id":1,"jsonrpc":"2.0","result":{"batchNumber":100}}');

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.batchNumber).toBe(100);
    });
  });
});

describe('Bridge Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet.era.zksync.io'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get bridge contracts successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBridgeContracts');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"result":{"l1Erc20DefaultBridge":"0x123","l2Erc20DefaultBridge":"0x456"}}');

    const result = await executeBridgeOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toHaveProperty('l1Erc20DefaultBridge');
  });

  it('should get L2 to L1 log proof successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getL2ToL1LogProof')
      .mockReturnValueOnce('0x123abc')
      .mockReturnValueOnce(1);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"result":{"merkleProof":["0x123"]}}');

    const result = await executeBridgeOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toHaveProperty('merkleProof');
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBridgeContracts');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const result = await executeBridgeOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBridgeContracts');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    await expect(executeBridgeOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Network error');
  });
});

describe('Paymaster Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://mainnet.era.zksync.io' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should estimate fee with paymaster successfully', async () => {
    const mockTransaction = { to: '0x123', value: '100', data: '0x' };
    const mockResponse = { result: { gasLimit: '21000', gasPrice: '1000000000' } };
    
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('estimateFee')
      .mockReturnValueOnce(mockTransaction);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePaymasterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: {
        id: 1,
        jsonrpc: '2.0',
        method: 'zks_estimateFee',
        params: [mockTransaction]
      },
      json: true
    });
  });

  it('should estimate gas L1 to L2 successfully', async () => {
    const mockTransaction = { to: '0x456', value: '200', data: '0xabc' };
    const mockResponse = { result: { gasEstimate: '50000' } };
    
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('estimateGasL1ToL2')
      .mockReturnValueOnce(mockTransaction);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePaymasterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: {
        id: 1,
        jsonrpc: '2.0',
        method: 'zks_estimateGasL1ToL2',
        params: [mockTransaction]
      },
      json: true
    });
  });

  it('should get testnet paymaster address successfully', async () => {
    const mockResponse = { result: '0x789abc...paymaster' };
    
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTestnetPaymaster');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePaymasterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet.era.zksync.io',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: {
        id: 1,
        jsonrpc: '2.0',
        method: 'zks_getTestnetPaymaster',
        params: []
      },
      json: true
    });
  });

  it('should handle API errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('estimateFee');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executePaymasterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executePaymasterOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Proof Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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

	it('should get Merkle proof successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getMerkleProof')
			.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D4dA2fA0C5F4eb38')
			.mockReturnValueOnce(['0x0000000000000000000000000000000000000000000000000000000000000000'])
			.mockReturnValueOnce(100);

		const mockResponse = {
			id: 1,
			jsonrpc: '2.0',
			result: {
				address: '0x742d35Cc6634C0532925a3b8D4dA2fA0C5F4eb38',
				storageProof: [],
			},
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should get raw block transactions successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getRawBlockTransactions')
			.mockReturnValueOnce(12345);

		const mockResponse = {
			id: 1,
			jsonrpc: '2.0',
			result: ['0xdeadbeef', '0xcafebabe'],
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should get block details successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBlockDetails')
			.mockReturnValueOnce(12345);

		const mockResponse = {
			id: 1,
			jsonrpc: '2.0',
			result: {
				number: 12345,
				timestamp: 1234567890,
				l1BatchNumber: 100,
			},
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should handle API errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getMerkleProof');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getMerkleProof');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeProofOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});
});

describe('Contract Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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

	describe('call operation', () => {
		it('should successfully call contract method', async () => {
			const transaction = { to: '0x123', data: '0xabc' };
			const blockNumber = 'latest';

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('call')
				.mockReturnValueOnce(transaction)
				.mockReturnValueOnce(blockNumber);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"result":"0x123","id":1,"jsonrpc":"2.0"}');

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { result: '0x123', id: 1, jsonrpc: '2.0' },
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle call operation error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('call')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('latest');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('estimateGas operation', () => {
		it('should successfully estimate gas', async () => {
			const transaction = { to: '0x123', data: '0xabc' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('estimateGas')
				.mockReturnValueOnce(transaction);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"result":"0x5208","id":1,"jsonrpc":"2.0"}');

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { result: '0x5208', id: 1, jsonrpc: '2.0' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getLogs operation', () => {
		it('should successfully get logs', async () => {
			const filter = { fromBlock: '0x1', toBlock: 'latest' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLogs')
				.mockReturnValueOnce(filter);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"result":[],"id":1,"jsonrpc":"2.0"}');

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { result: [], id: 1, jsonrpc: '2.0' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('zksGetTokenPrice operation', () => {
		it('should successfully get token price', async () => {
			const tokenAddress = '0x123';

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('zksGetTokenPrice')
				.mockReturnValueOnce(tokenAddress);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"result":"1000000","id":1,"jsonrpc":"2.0"}');

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { result: '1000000', id: 1, jsonrpc: '2.0' },
				pairedItem: { item: 0 },
			}]);
		});
	});
});
});

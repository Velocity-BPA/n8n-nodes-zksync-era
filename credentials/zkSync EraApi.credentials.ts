import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class zkSyncEraApi implements ICredentialType {
	name = 'zkSyncEraApi';
	displayName = 'zkSync Era API';
	documentationUrl = 'https://era.zksync.io/docs/';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
				},
				{
					name: 'Sepolia Testnet',
					value: 'testnet',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'mainnet',
			required: true,
			description: 'The zkSync Era network environment',
		},
		{
			displayName: 'RPC URL',
			name: 'rpcUrl',
			type: 'string',
			default: 'https://mainnet.era.zksync.io',
			required: true,
			displayOptions: {
				show: {
					environment: [
						'custom',
					],
				},
			},
			description: 'Custom RPC endpoint URL',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Private key for transaction signing (required for write operations)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for provider services (optional, for rate limiting)',
		},
		{
			displayName: 'Request Timeout',
			name: 'timeout',
			type: 'number',
			default: 30000,
			description: 'Request timeout in milliseconds',
		},
	];
}
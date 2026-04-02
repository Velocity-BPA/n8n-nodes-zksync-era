import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class zkSyncEraApi implements ICredentialType {
	name = 'zkSyncEraApi';
	displayName = 'zkSync Era API';
	documentationUrl = 'https://era.zksync.io/docs/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Endpoint',
			name: 'apiEndpoint',
			type: 'string',
			default: 'https://mainnet.era.zksync.io',
			description: 'The zkSync Era RPC endpoint URL',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for the RPC provider (if required)',
		},
		{
			displayName: 'Provider',
			name: 'provider',
			type: 'options',
			options: [
				{
					name: 'zkSync Era Mainnet',
					value: 'mainnet',
				},
				{
					name: 'zkSync Era Testnet',
					value: 'testnet',
				},
				{
					name: 'Alchemy',
					value: 'alchemy',
				},
				{
					name: 'QuickNode',
					value: 'quicknode',
				},
				{
					name: 'Ankr',
					value: 'ankr',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'mainnet',
			description: 'The RPC provider to use',
		},
	];
}
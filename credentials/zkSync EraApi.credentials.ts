import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class zkSyncEraApi implements ICredentialType {
	name = 'zkSyncEraApi';
	displayName = 'zkSync Era API';
	documentationUrl = 'https://era.zksync.io/docs/';
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
				},
				{
					name: 'Testnet',
					value: 'testnet',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'mainnet',
			required: true,
		},
		{
			displayName: 'Custom RPC URL',
			name: 'customRpcUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-custom-rpc-endpoint.com',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
			required: true,
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: '0x...',
			description: 'Private key for transaction signing (optional, only needed for write operations)',
		},
		{
			displayName: 'Wallet Address',
			name: 'walletAddress',
			type: 'string',
			default: '',
			placeholder: '0x...',
			description: 'Associated wallet address (optional)',
		},
	];
}
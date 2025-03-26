import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MetisAiApi implements ICredentialType {
	name = 'metisAiApi';
	displayName = 'Metis AI API';
	documentationUrl = 'https://docs.metisai.ir';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'Your secret API key',
		},
	];
}

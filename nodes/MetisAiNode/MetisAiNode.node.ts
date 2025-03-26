import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import axios from 'axios';



export async function createSession(apiKey: string, botId: string,initialMessage: string,type: string) {
	console.log('createSession', apiKey, botId);
	const response = await axios.post('https://api.metisai.ir/api/v1/chat/session', {
	  botId,
	  user: null,
	  initialMessages: [{ type: type, content: initialMessage }],
	}, {
	  headers: { Authorization: `Bearer ${apiKey}` },
	});
  
	return response.data.id;
  }
  
  export async function sendMessage(apiKey: string, sessionId: string, prompt: string) {
	console.log('sendMessage', apiKey, sessionId, prompt);
	const response = await axios.post(`https://api.metisai.ir/api/v1/chat/session/${sessionId}/message`, {
	  message: { content: prompt, type: 'USER' },
	}, {
	  headers: { Authorization: `Bearer ${apiKey}` },
	});
  
	return response.data;
  }
  
  
export class MetisAiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MetisAi Node',
		name: 'MetisAiNode',
		group: ['transform'],
		version: 2,
		description: 'MetisAi Node with Credential',
		defaults: {
			name: 'MetisAi Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'metisAiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'BOT ID',
				name: 'botId',
				type: 'string',
				default: '',
				placeholder: 'Bot ID',
				description: 'Bot ID',
			},
			{
				displayName: 'Initial Message Type',
				name: 'initialMessageType',
				type: 'options',
				default: 'USER',
				description: 'Choose initial message type',
				options: [
					{
						name: 'user',
						value: 'USER',
					},
					{
						name: 'system',
						value: 'SYSTEM',
					}
				],
			},
			{
				displayName: 'Initial Message',
				name: 'initialMessage',
				type: 'string',
				default: 'Test',
				placeholder: 'Initial Message',
				description: 'initial message content',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				placeholder: 'Prompt',
				description: 'Prompt',
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('metisAiApi');
		const apiKey = credentials.apiKey as string;
		const initialMessageType = this.getNodeParameter('initialMessageType', 0) as string;
		const initialMessage = this.getNodeParameter('initialMessage', 0) as string;

		let botId = this.getNodeParameter('botId', 0) as string;
		let prompt = this.getNodeParameter('prompt', 0) as string;

	
		const sessionId = await createSession(apiKey, botId,initialMessage,initialMessageType);
		const result = await sendMessage(apiKey, sessionId, prompt);
	
		return [this.helpers.returnJsonArray(result)];

	}
}

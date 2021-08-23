const restify = require('restify');
const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const { BotActivivtyHandler } = require('./BotActivityHandler');
const { RootDialogs } = require('./Dialogs/RootDialogs')

const { LeaveRecognizer } = require('./Dialogs/leaveRecognizer')

const adapter = new BotFrameworkAdapter({
    appId: '',
    appPassword: ''
})

adapter.onTurnError = async(context, error) => {
    console.log('Error encountered ==>', error);
    await context.sendActivity('Error has been encountered by Bot');
}

const luisConfig = {
    applicationId: '4f6e35de-6907-4dd6-9654-ebc5cc585a5c',
    endpointKey: '3bc001683bab47088bd4915e01856053',
    endpoint: 'https://trainingchatbotluis-authoring.cognitiveservices.azure.com/'
}

const luisRecognizer = new LeaveRecognizer(luisConfig);

//console.log(luisRecognizer.recognizer.recognize)
const server = restify.createServer();

server.listen(3978, () => {
    console.log(`${server.name} is listing to Bot ${server.url}`)
})

const memory = new MemoryStorage();
let conversationState = new ConversationState(memory);
const rootDialogs = new RootDialogs(conversationState, luisRecognizer);
const mainBot = new BotActivivtyHandler(conversationState, rootDialogs);

server.post('/api/messages', (req,res) => {
    adapter.processActivity(req,res, async (context) => {
        await mainBot.run(context);
    })
})

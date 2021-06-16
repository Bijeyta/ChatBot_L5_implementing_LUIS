const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs')
const { CardFactory } = require('botbuilder')
const { LuisRecognizer } = require('botbuilder-ai')
const { LeaveappDialog, HrhelpDeskDialog, PayRollDialog } = require('./classes')
const { rootDialogs, hrHelpDeskDialog, leaveappDialog, salaryslipDialog } = require('../Constants/DialogIds');
const { SalaryslipDialog } = require('./salaryslipDialog');

const parseMessage = 'parseMessage';

const luisConfig = {
    applicationId: 'your appId',
    endpointKey: 'primary key or secondary key',
    endpoint: 'end point url'
}

class RootDialogs extends ComponentDialog {
    constructor(conversationState,luisRecognizer) {
        super(rootDialogs) 
        if(!conversationState) throw new Error ('Conversation State is required');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(parseMessage, [
            this.routeMessage.bind(this)
        ]));

        this.luisRecognizer = luisRecognizer
        this.recognizer = new LuisRecognizer(luisConfig, {
            apiVersion: 'v3'
        })

        this.addDialog(new LeaveappDialog(conversationState));
        this.addDialog(new HrhelpDeskDialog(conversationState));
        this.addDialog(new PayRollDialog(conversationState));
        this.addDialog(new SalaryslipDialog(conversationState));

        this.initialDialogId = parseMessage;
    }
    async run(context, accessor){
        try {
            const dialogSet = new DialogSet(accessor)
            dialogSet.add(this)
            const dialogContext = await dialogSet.createContext(context);
            const results = await dialogContext.continueDialog();
            if(results && results.status === DialogTurnStatus.empty){
                await dialogContext.beginDialog(this.id);
            } else {
                console.log('dialog stack is empty');
            } 
        } catch(err) {
            console.log(err);
        }
    }

    async routeMessage(stepContext) {
        const leaveDetails = {}; 

        let luisresponse = await this.luisRecognizer.excuteLuisQuery(stepContext.context);
        console.log(luisresponse);
        console.log(LuisRecognizer.topIntent(luisresponse).toLowerCase())
        switch(LuisRecognizer.topIntent(luisresponse).toLowerCase()) {
            case 'leaveapp':{
                const fromEntities = this.luisRecognizer.getFromEntities(luisresponse);
                leaveDetails.leaveType = fromEntities.leaveType
                leaveDetails.NoOfDays = fromEntities.NoOfDays;
                leaveDetails.date = fromEntities.date;
                //leaveDetails.date = this.luisRecognizer.getLeaveDate(luisresponse);
                console.log('LUIS extracted these leaving details:', JSON.stringify(leaveDetails));
                return await stepContext.beginDialog(leaveappDialog, leaveDetails);
            }
            case 'hr help':
                return await stepContext.beginDialog(hrHelpDeskDialog);
            case 'salary slip':
                return await stepContext.beginDialog(salaryslipDialog);
            case 'it help':
                return await stepContext.context.sendActivity('Welcome to Celebal Technology, IT Help Desk');
            case 'sales':
                return await stepContext.context.sendActivity('Welcome to Celebal Technology, Sales Management');
            case 'admin':
                return await stepContext.context.sendActivity('Welcome to Celebal Technology, Admin Panel');
            default:
                return await stepContext.context.sendActivity('bhagg yaha se');

        }
    }
}
module.exports.RootDialogs = RootDialogs;
const { CardFactory } = require('botbuilder');
const {  ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs')
// const { LuisRecognizer } = require('botbuilder-ai')

const { hrHelpDeskDialog, leaveappDialog, payRollDialog } = require('../Constants/DialogIds')

const hrHelpDeskDialogWF1 = 'hrHelpDeskDialogWF1'

class HrhelpDeskDialog extends ComponentDialog {
    constructor(conversationState, luisRecognizer) {

        super(hrHelpDeskDialog);
        if(!conversationState) throw new Error ('ConversationState are required');
        // if(!luisRecognizer) throw new Error ('Luis recognizer are required');

        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(hrHelpDeskDialogWF1, [
            this.heroCardshow.bind(this),
            this.receiveMessage.bind(this)
        ]));
        // this.luisRecognizer = luisRecognizer;

        this.initialDialogId = hrHelpDeskDialogWF1;
    }
    async heroCardshow(stepContext) {
        await stepContext.context.sendActivity('Welcome to Celebal Technology HR Help Desk!')
        await stepContext.context.sendActivity({
            attachments: [CardFactory.heroCard(
                'Here are some suggesstion that you can try',
                null,
                CardFactory.actions([
                    {
                        type: 'imBack',
                        title: 'Leave Management',
                        value: 'Leave Management'
                    },
                    {
                        type: 'imBack',
                        title: 'Payroll',
                        value: 'Payroll'
                    },
                    {
                        type: 'imBack',
                        title: 'Recruitment',
                        value: 'Recruitment'
                    },
                    {
                        type: 'imBack',
                        title: 'L&D',
                        value: 'L&D'
                    },
                    {
                        type: 'imBack',
                        title: 'Survey',
                        value: 'Survey'
                    },
                    {
                        type: 'imBack',
                        title: 'Holiday Calendar',
                        value: 'Holiday Calendar'
                    }
                ])
            )]
        });
        return ComponentDialog.EndOfTurn;
    }
    async receiveMessage(stepContext) {

        //const leaveDetails = {}; 
        
        // LuisRecognizer.topIntent(luisresponse.toLowerCase())
        //let luisresponse = await this.luisRecognizer.excuteLuisQuery(stepContext.context);
        switch(stepContext.context.activity.text.toLowerCase()) {
            case 'hr help':{
                // const fromEntities = this.luisRecognizer.getFromEntities(luisresponse);
                // leaveDetails.NoOfDays = fromEntities.NoOfDays;
                // leaveDetails.date = this.luisRecognizer.getLeaveDate(luisresponse);
                // console.log('LUIS extracted these leaving details:', JSON.stringify(leaveDetails));
                return await stepContext.beginDialog('leaveappDialog', leaveDetails);
            }
            case 'payroll':
                return await stepContext.beginDialog(payRollDialog);
            case 'recruitment':
                return await stepContext.context.sendActivity('From Users');
            default:
                return await stepContext.context.sendActivity('Sorry!, You choise were wrong');
        }
    }
    
}


module.exports.HrhelpDeskDialog = HrhelpDeskDialog;
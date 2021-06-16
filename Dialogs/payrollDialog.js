const { CardFactory } = require('botbuilder-core');
const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs')
const { payRollDialog, salaryslipDialog } = require('../Constants/DialogIds')

const payRollDialogWF1 = 'payRollDialogWF1';

class PayRollDialog extends ComponentDialog {
    constructor(conversationState) {
        super(payRollDialog);

        if(!conversationState) throw new Error ('Conversation State is required');
        this.conversationState = conversationState;
        
        this.addDialog(new WaterfallDialog(payRollDialogWF1, [
            this.showpayRoll.bind(this),
            this.selectOne.bind(this)
        ]));

        this.initialDialogId = payRollDialogWF1;
    }
    async showpayRoll(stepContext) {
        await stepContext.context.sendActivity('Here are some mostly asked questions');
        await stepContext.context.sendActivity({
            attachments: [CardFactory.heroCard(
                'Here are some suggesstion that you can try',
                null,
                CardFactory.actions([
                    {
                        type: 'imBack',
                        title: 'Salary Slip',
                        value: 'Salary Slip'
                    },
                    {
                        type: 'imBack',
                        title: 'Bonus',
                        value: 'Bonus'
                    },
                    {
                        type: 'imBack',
                        title: 'Reimbursement',
                        value: 'Reimbursement'
                    },
                    {
                        type: 'imBack',
                        title: 'PF',
                        value: 'PF'
                    },
                    {
                        type: 'imBack',
                        title: 'Gratuity',
                        value: 'Gratuity'
                    },
                    {
                        type: 'imBack',
                        title: 'Investment Details',
                        value: 'Investment Details'
                    }
                ])
            )]
        });
        return ComponentDialog.EndOfTurn;
    }
    async selectOne(stepContext) {
        switch(stepContext.context.activity.text.toLowerCase()) {
            case 'salary slip':
                return stepContext.beginDialog(salaryslipDialog)            
            case 'bonus':
                return await stepContext.context.sendActivity('Bonus');
            case 'reimbursement':
                return await stepContext.context.sendActivity('Reimbursement');
            default:
                return await stepContext.context.sendActivity('Sorry, you have entered the wrong choise')
        }
    }
}
module.exports.PayRollDialog = PayRollDialog;
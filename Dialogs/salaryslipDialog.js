const { ComponentDialog, WaterfallDialog , TextPrompt} = require('botbuilder-dialogs');
const { salaryslipDialog } = require('../Constants/DialogIds');

const salaryslipDialogWF1 = 'salaryslipDialogWF1'

const TextPromptDialog = 'TextPromptDialog'

class SalaryslipDialog extends ComponentDialog {
    constructor(conversationState) {
        super(salaryslipDialog);
        if(!conversationState) throw new Error ('Conversation State is required');

        this.conversationState = conversationState;

        this.addDialog(new TextPrompt(TextPromptDialog))
        this.addDialog(new WaterfallDialog(salaryslipDialogWF1, [
            this.asksliptype.bind(this),
            this.askemployeeid.bind(this),
            this.askemployeeid.bind(this),
            this.askMonth.bind(this),
            this.getyourName.bind(this)
        ]));

        this.initialDialogId = salaryslipDialogWF1;

    }
    async asksliptype(stepContext) {
        return await stepContext.prompt(ChoicePromptDialog, {
            prompt: 'Please help me with the type of slip you want to apply for',
            choices: ChoiceFactory.toChoices(['Salary Slip','Pf slip','Bonus slip'])
        })
    }

    async askemployeeid(stepContext) {
        let dialogDate = await this.salaryslipStateAccessor.get(stepContext.context, {});
        dialogDate.slipType = stepContext.result.value;
        console.log(dialogDate);
        return await stepContext.prompt(NumberPromptDialog, `Enter your employee id`);
    }

    async askMonth(stepContext) {
        await stepContext.prompt(TextPromptDialog, `For which month you want your Salary slip`);
        return ComponentDialog.EndOfTurn;
    }

    async getyourName(stepContext) {
        let dialogDate = await this.salaryslipStateAccessor.get(stepContext.context);
        dialogDate.employee_id = stepContext.result; 
        console.log(dialogDate.employee_id);
        let result = await db.employeedata()
        console.log(result);
        if(dialogDate.employee_id == result[1].employee_id) {
            await stepContext.context.sendActivity(`Hello ${result[1].first_name}!, your salary amount is ${result[1].basic_salary} `);
            return stepContext.endDialog();
        } else {
            await stepContext.context.sendActivity('You have entered wrong employee id, Kindly try it again');
            return stepContext.endDialog();
        }
    }
}

module.exports.SalaryslipDialog = SalaryslipDialog;
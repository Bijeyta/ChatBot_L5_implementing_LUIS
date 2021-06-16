const { ComponentDialog, DialogSet, WaterfallDialog, ChoicePrompt, ChoiceFactory, NumberPrompt, TextPrompt  } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder')
const { leaveappDialog } = require('../Constants/DialogIds')
const { confirmleave } = require('../cards/cards')

const { LuisRecognizer } = require('botbuilder-ai');
const Recognizers = require('@microsoft/recognizers-text-suite');
const luisConfig = {
    applicationId: '4f6e35de-6907-4dd6-9654-ebc5cc585a5c',
    endpointKey: '3bc001683bab47088bd4915e01856053',
    endpoint: 'https://trainingchatbotluis-authoring.cognitiveservices.azure.com/'
}

const leaveappDialogWF1 = 'leaveappDialogWF1'

const ChoisePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';
const ChoisePromptDialog1 = 'ChoicePromptDialog1';

class LeaveappDialog extends ComponentDialog {
    constructor(conversationState) {
        super(leaveappDialog);
        if(!conversationState) throw new Error ('Conversation state is required');
        this.conversationState = conversationState;
        this.applyLeaveStateAccessor = this.conversationState.createProperty('ApplyLeaveState');


        this.addDialog(new ChoicePrompt(ChoisePromptDialog));
        this.addDialog(new NumberPrompt(NumberPromptDialog));
        this.addDialog(new TextPrompt(TextPromptDialog));
        

        this.addDialog(new WaterfallDialog(leaveappDialogWF1, [
            //this.showCard.bind(this),
            this.applyleavetype.bind(this),
            this.askNoOfDays.bind(this),
            this.askleavedate.bind(this),
            this.applyLeave.bind(this),
            this.applyApplication.bind(this)
        ]));
        this.recognizer = new LuisRecognizer(luisConfig, {
            apiVersion: 'v3'
        })

        this.initialDialogId = leaveappDialogWF1;
    }
    async applyleavetype(stepContext) {
        const dialogData = stepContext.options
        console.log(dialogData, 'All data')
        console.log(dialogData.leaveType, "ysgjef")
       if(!dialogData.leaveType) {
            await stepContext.prompt(ChoisePromptDialog, {
                prompt: 'Here are some suggesion that you can try',
                choices: ChoiceFactory.toChoices(['Sick Leave', 'Causal Leave', 'Earned Leave'])
           });
           return ComponentDialog.EndOfTurn;
        }
        return await stepContext.next(dialogData.leaveType);

        // return stepContext.next(dialogData)
        // return ComponentDialog.EndOfTurn;
    }
    async askNoOfDays(stepContext) {
        //let dialogData = await this.applyLeaveStateAccessor.get(stepContext.context, {});
        const dialogData = stepContext.options
        console.log(dialogData, 'All data in noofdays')
        dialogData.leaveType = stepContext.result;
        console.log(dialogData.leaveType, 'finding leave type')
        //console.log(dialogData, 'leaveType');
        if(!dialogData.NoOfDays) {
            return await stepContext.prompt(NumberPromptDialog,`For how many days you want to apply ${dialogData.leaveType}` ); 
        }
        return await stepContext.next(dialogData.NoOfDays)
    }
    async askleavedate(stepContext) {
        //let dialogData = await this.applyLeaveStateAccessor.get(stepContext.context);
        const dialogData = stepContext.options
        dialogData.NoOfDays = stepContext.result;
        console.log(dialogData, 'ask keave date')
        if(!dialogData.date) {
            return await stepContext.prompt(TextPromptDialog,`From which date I should apply this ${dialogData.leaveType} application` )
        }
        return stepContext.next(dialogData.date)
        
    }
    async applyLeave(stepContext) {
        const dialogData = stepContext.options
        dialogData.date = stepContext.result;
        console.log(dialogData, 'Dialogdata')
        
        await stepContext.context.sendActivity(`You had applied leave for ${dialogData.leaveType} from ${dialogData.date} for ${dialogData.NoOfDays} `);
        await stepContext.prompt(ChoisePromptDialog, {
            prompt: 'Do you really want to apply leave?',
            choices: ChoiceFactory.toChoices(['Yes', 'No'])
        })
        return ComponentDialog.EndOfTurn;
    }

    async applyApplication(stepContext) {
        //let dialogData = await this.applyLeaveStateAccessor.get(stepContext.context);
        let dialogData = stepContext.options
        dialogData.applyApplication = stepContext.result.value;
        console.log(dialogData)
        if(dialogData.applyApplication == 'Yes') {
            await stepContext.context.sendActivity({
                attachments: [
                    CardFactory.adaptiveCard(confirmleave(dialogData.leaveType,dialogData.NoOfDays, dialogData.date))
                ]
            });
            await stepContext.context.sendActivity('You had applied for the leave successfully!');
            return stepContext.endDialog();
        } else {
            await stepContext.context.sendActivity('Want to apply leave');
            await context.sendActivity({
                attachments: [CardFactory.heroCard(
                    'Here are some suggesstion that you can try',
                    null,
                    CardFactory.actions([
                        {
                            type: 'imBack',
                            title: 'HR Help Desk',
                            value: 'HR Help'
                        },
                        {
                            type: 'imBack',
                            title: 'IT Help Desk',
                            value: 'IT Help'
                        },
                        {
                            type: 'imBack',
                            title: 'Sales',
                            value: 'Sales'
                        },
                        {
                            type: 'imBack',
                            title: 'Admin',
                            value: 'Admin'
                        }
                    ])
                )]
            });
            return stepContext.endDialog();
        }


        // dialogData.leavedate = stepContext.result;
        // await stepContext.context.sendActivity({
        //     attachments: [
        //         CardFactory.adaptiveCard(confirmleave(dialogData.leaveType,dialogData.leavedays,dialogData.leavedate))
        //     ]
        // });
        // return stepContext.endDialog();
        
    } 
    
}

module.exports.LeaveappDialog = LeaveappDialog;





// async showCard(stepContext) {
    //     await stepContext.context.sendActivity({
    //         attachments: [CardFactory.adaptiveCard({
    //             "type": "AdaptiveCard",
    //             "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    //             "version": "1.3",
    //             "body": [
    //                 {
    //                     "type": "ColumnSet",
    //                     "columns": [
    //                         {
    //                             "type": "Column",
    //                             "width": "stretch",
    //                             "items": [
    //                                 {
    //                                     "type": "Image",
    //                                     "url": "https://www.celebaltech.com/assets/img/celebal.webp",
    //                                     "size": "Medium"
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             "type": "Column",
    //                             "width": "stretch",
    //                             "items": [
    //                                 {
    //                                     "type": "TextBlock",
    //                                     "text": "Celebal Technology",
    //                                     "wrap": true,
    //                                     "size": "Medium",
    //                                     "weight": "Bolder"
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "type": "TextBlock",
    //                     "text": "Leave Application",
    //                     "wrap": true,
    //                     "separator": true,
    //                     "size": "Medium",
    //                     "color": "Warning",
    //                     "weight": "Bolder",
    //                     "horizontalAlignment": "Center"
    //                 },
    //                 {
    //                     "type": "TextBlock",
    //                     "text": "Select the type of leave you want",
    //                     "wrap": true,
    //                     "separator": true,
    //                     "size": "Medium",
    //                     "weight": "Bolder",
    //                     "color": "Dark"
    //                 },
    //                 {
    //                     "type": "Input.ChoiceSet",
    //                     "choices": [
    //                         {
    //                             "title": "Sick Leave",
    //                             "value": "sl"
    //                         },
    //                         {
    //                             "title": "Causal Leave",
    //                             "value": "cl"
    //                         },
    //                         {
    //                             "title": "Earned Leave",
    //                             "value": "el"
    //                         }
    //                     ],
    //                     "placeholder": "--select--",
    //                     "id": "leaveType"
    //                 },
    //                 {
    //                     "type": "TextBlock",
    //                     "text": "Enter the number of days for which you want leave",
    //                     "wrap": true,
    //                     "size": "Medium",
    //                     "weight": "Bolder",
    //                     "color": "Dark"
    //                 },
    //                 {
    //                     "type": "Input.Number",
    //                     "id": "noDays",
    //                     "placeholder": "Enter number of days",
    //                     "min": 1,
    //                     "max": 3
    //                 },
    //                 {
    //                     "type": "TextBlock",
    //                     "text": "Enter the date from which you want to apply leave",
    //                     "wrap": true,
    //                     "size": "Medium",
    //                     "weight": "Bolder",
    //                     "color": "Dark"
    //                 },
    //                 {
    //                     "type": "Input.Date",
    //                     "id": "noDate"
    //                 },
    //                 {
    //                     "type": "ActionSet",
    //                     "actions": [
    //                         {
    //                             "type": "Action.Submit",
    //                             "id": "apply",
    //                             "title": "Apply"
    //                         }
    //                     ],
    //                     "id": "sub"
    //                 },
    //                 {
    //                     "type": "ActionSet",
    //                     "actions": [
    //                         {
    //                             "type": "Action.Submit",
    //                             "id": "cancel",
    //                             "title": "Cancel"
    //                         }
    //                     ],
    //                     "id": "can"
    //                 }
    //             ]
    //         })]
    //     });
    //     return ComponentDialog.EndOfTurn;
    // }ddddddw
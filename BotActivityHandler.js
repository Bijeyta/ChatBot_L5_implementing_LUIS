const { ActivityHandler, CardFactory  } = require('botbuilder');

class BotActivivtyHandler extends ActivityHandler {
    constructor(conversationState, rootDialog) {
        super();
        if(!conversationState) throw new Error ('ConversationState are required');
        this.conversationState = conversationState;
        this.rootDialog = rootDialog;
        this.accessor = this.conversationState.createProperty('DialogAccessor')

        this.onMessage(async (context, next) => {
            await this.rootDialog.run(context, this.accessor)
            await next();
        })
        this.onConversationUpdate(async (context, next) => {
            if(context.activity.membersAdded && context.activity.membersAdded[1].id == context.activity.from.id) {
                await context.sendActivity({
                    attachments: [CardFactory.adaptiveCard({
                        "type": "AdaptiveCard",
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                        "version": "1.3",
                        "body": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://www.celebaltech.com/assets/img/celebal.webp",
                                                "size": "Medium"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "wrap": true,
                                                "text": "Celebal Technology",
                                                "size": "Medium",
                                                "fontType": "Default",
                                                "weight": "Bolder",
                                                "color": "Warning"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "TextBlock",
                                "wrap": true,
                                "text": "Welcome to Celebal Technology, This is CT-Lusia, your personal assistant. I can help you in HR and IT.",
                                "color": "Dark"
                            }
                        ]
                    })]
                });
    
                await context.sendActivity({
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
                            },
                            {
                                type: 'imBack',
                                title: 'Salary slip',
                                value: 'Salary slip'
                            }
                        ])
                    )]
                });
            }
            await next();
        })
    }

    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false)
    }
}
module.exports.BotActivivtyHandler = BotActivivtyHandler;
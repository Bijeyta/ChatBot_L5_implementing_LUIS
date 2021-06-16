const { LuisRecognizer } = require('botbuilder-ai');

class LeaveRecognizer {
    constructor(config) {
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {

            const recognizerOptions = {
                apiVersion: 'v3'
            };

            this.recognizer = new LuisRecognizer(config, recognizerOptions);
        } 
    }
    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    async excuteLuisQuery(context) {
        console.log('hello')
        return await this.recognizer.recognize(context)
    }

    getFromEntities(result) {
        let date, NoOfDays, leaveType, salarySlipMonth
        console.log(result);
        console.log(result.entities.$instance, "Hii")

        
        if(result.entities.$instance.datetime) {
            NoOfDays = result.entities.$instance.datetime[0].text;
            // console.log(result.entities.$instance.datetime[0].text, 'NoOfDays')
        }

        
        if(result.entities.$instance.datetime) {
            // console.log(result.entities.$instance)
            date = result.entities.$instance.datetime[1].text
            //console.log(result.entities.$instance.datetime[1].text, 'Date')
        }

        
        if(result.entities.$instance.leaveType) {
            console.log(result.entities.$instance.leaveType[0].text, 'leaveType')
            leaveType = result.entities.$instance.leaveType[0].text
            
        }
        return { leaveType: leaveType, date: date, NoOfDays: NoOfDays }
    }

}

module.exports.LeaveRecognizer = LeaveRecognizer;
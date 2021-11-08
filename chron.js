const pubsub = require('pubsub-js');
const cron = require('node-cron');
const common = require('./common');

function init(){

    let isValidCronExpression = cron.validate(common.config.chechAllSourceCronShedule);
    
    if(isValidCronExpression){
        cron.schedule(common.config.chechAllSourceCronShedule, ()=>{
            console.log("Called shedule check all datasource: "+new Date());
            pubsub.publish(common.CHECK_ALL_DATASOURCE_TOPIC, null);
        });
        console.log("Cron shedule registered at '"+common.config.chechAllSourceCronShedule+"'");
    } else 
        console.log("GRAVE! cron expression '"+common.config.chechAllSourceCronShedule+"' is not valid");
}
module.exports.init = init;
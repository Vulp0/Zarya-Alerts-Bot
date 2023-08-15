require('dotenv').config()

const {Telegraf} = require("telegraf");
const bot = new Telegraf(process.env.TKEY);

console.log("Bot is now running...");


bot.start(ctx => {
    ctx.sendMessage("You've just started this bot, how cool is that?");
});

bot.help(ctx => {

    let userMsgArray = ctx.message.text.split(" ");
    let userArg;
    let messageTemplate = "";
    let commandList = ["credits", "check", "shibe", "rng"];

    if(userMsgArray[1]) {
        userArg = userMsgArray[1];

        switch (userArg) {
            //prepare for JANK
            case commandList[0]:
                messageTemplate += "<b>Command:</b> /credits" + "\n<b>Parameters:</b> <i>NONE</i>";
                messageTemplate += "\n<b>Desc:</b> Shows you how many Livecoinwatch api calls you have left." + "\n<b>Example:</b> /credits";

                ctx.sendMessage(messageTemplate, {
                    parse_mode: "HTML"
                });
                break;
            case commandList[1]:
                messageTemplate += "<b>Command:</b> /check" + "\n<b>Parameters:</b> <i>(text: code)</i>";
                messageTemplate += "\n<b>Desc:</b> Given a coin code, return its name, current price, and the date in which it was checked.";
                messageTemplate += "\n<b>Example:</b> /check eth";

                ctx.sendMessage(messageTemplate, {
                    parse_mode: "HTML"
                });
                break;
            case commandList[2]:
                messageTemplate += "<b>Command:</b> /shibe" + "\n<b>Parameters:</b> <i>NONE</i>";
                messageTemplate += "\n<b>Desc:</b> Sends you a pic of a shiba inu, just because.";
                messageTemplate += "\n<b>Example:</b> /shibe";

                ctx.sendMessage(messageTemplate, {
                    parse_mode: "HTML"
                });
                break;
            case commandList[3]:
                messageTemplate += "<b>Command:</b> /rng" + "\n<b>Parameters:</b> <i>(number: limit)</i>";
                messageTemplate += "\n<b>Desc:</b> Returns a random number from 0 to whatever number you give it";
                messageTemplate += "\n<b>Example:</b> /rng 100";

                ctx.sendMessage(messageTemplate, {
                    parse_mode: "HTML"
                });
                break;
        
            default:
                ctx.sendMessage("Did you type the name right? Does that command even exist?");
                break;
        }
    } else {
        ctx.sendMessage("To get more info about a specific command, type <i>/help</i> then the name of command.", {
            parse_mode: "HTML"
        });
    }
});

// bot.settings(ctx => {
//     ctx.sendMessage("How about i set deez balls in ur mouth lmao");
// });

bot.command("rng", ctx => {
    let userMsgArray = ctx.message.text.split(" ");
    let userArg = Number.parseInt(userMsgArray[1]);

    if(userMsgArray.length == 2 && Number.isInteger(userArg)){
        let result = "Here's a random number between 0 and " + userMsgArray[1] + ": \n" + (Math.floor(Math.random()*userArg)).toString();
        ctx.sendMessage(result);
    } else {
        ctx.sendMessage("You didn't follow proper syntax, type \"/help rng\" for more info");
    }
});

bot.command("shibe", ctx => {
    ctx.sendMessage("Getting a random shiba picture, wait a moment");
    fetch("https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true")
        .then(response => response.json())
        .then(jsonResponse => {
            ctx.sendPhoto(jsonResponse[0], {caption: "Here's your shiba!"});
        });
});

//test command, serves no practical purpose other than me learning how it works
// bot.command("replyme", ctx => {
//     let userMsgArray = ctx.message.text.split(" ");

//     let messageTemplate = "Replying to <b>" + ctx.message.from.first_name + "'s</b> message. Message content: \"<i>" + userMsgArray.join(" ") + "</i>\"";
//     ctx.reply(messageTemplate, {
//         reply_to_message_id: ctx.message.message_id,
//         parse_mode: "HTML"
//     });
// });

bot.command("credits", ctx => {
    let apiCallUrl = "https://api.livecoinwatch.com/credits";

    fetch(apiCallUrl, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
            "x-api-key": process.env.LCWKEY
        })
    })
    .then(response => response.json())
    .then(jsonResponse => {
        let result = jsonResponse;
        let messageTemplate = `Your remaining LCW API credits: ${result["dailyCreditsRemaining"]}/${result["dailyCreditsLimit"]}`;

        ctx.sendMessage(messageTemplate);
    });
});

bot.command("check", ctx => {
    let userMsgArray = ctx.message.text.split(" ");
    let messageTemplate = "";

    if(userMsgArray.length == 1) {
        ctx.sendMessage("Missign argument. Type \"/help check\" for more info");
    } else {
        let userInput = userMsgArray[1];
        let apiCallUrl = "https://api.livecoinwatch.com/coins/single";

        ctx.sendMessage(`Fetching info about ${userInput.toUpperCase()}, hold on...`);

        fetch(apiCallUrl, {
            method: "POST",
            headers: new Headers({
                "content-type": "application/json",
                "x-api-key": process.env.LCWKEY
            }),
            body: JSON.stringify({
                currency: "USD",
                code: userInput.toUpperCase(),
                meta: true
            })
        })
        .then(response => response.json())
        .then(jsonResponse => {
            let result = jsonResponse;
            //this is such a mess, man
            let messageTemplate = `${result["name"]} (${userInput.toUpperCase()})\nPriced at $${result["rate"]}\nAs of: ${new Date}`;
            ctx.sendMessage(messageTemplate);
        });
    }

});

//commented out for the time being, WIP WIP WIP WIP
// bot.command("change", ctx => {
//     let userMsgArray = ctx.message.text.split(" ");
//     let commandSwitch = false;
//     let messageTemplate = "";

//     if(userMsgArray.length == 1) {
//         ctx.sendMessage("Missign argument: code. Correct command usage: \"/change BTC 10\"");
//     }
// })

bot.launch();
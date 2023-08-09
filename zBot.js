require('dotenv').config()

const {Telegraf} = require("telegraf");
const bot = new Telegraf(process.env.TKEY);

console.log("Bot is now running...");


bot.start(ctx => {
    ctx.sendMessage("You've just started this bot, how cool is that?");
});

//start, help and settings all have to be defined commands, because of good practices
//idk what to put in them yet so they're commented out for now

// bot.help(ctx => {
//     ctx.sendMessage("Nobody is coming to help you");
// });

// bot.settings(ctx => {
//     ctx.sendMessage("How about i set deez balls in ur mouth lmao");
// });

bot.command("rng", ctx => {
    let userMsgArray = ctx.message.text.split(" ");
    let userParam = Number.parseInt(userMsgArray[1]);

    if(userMsgArray.length == 2 && Number.isInteger(userParam)){
        let result = "Here's a random number between 0 and " + userMsgArray[1] + ": \n" + (Math.floor(Math.random()*userParam)).toString();
        ctx.sendMessage(result);
    } else {
        ctx.sendMessage("You didn't follow proper syntax, use: /rng 100");
    }
});

// bot.command("whoyou", ctx => {
//     ctx.sendMessage("I'm " + ctx.botInfo.first_name + "!");
// });

// bot.command("whome", ctx => {
//     ctx.sendMessage("You're " + ctx.update.message.from.username + "!");
// });

//note to myself, telegram is not like discord so if you want to handle arguments in commands, you'll have to do something like this
//separate the user's text into an array, where index 0 will be the /command itself, and from index 1 onwards are the "parameters" for the command
// bot.command("say", ctx => {
//     let userMsgArray = ctx.message.text.split(" ");

//     if(userMsgArray.length == 1){
//         ctx.sendMessage("Say what? Use: /say <whatever>");
//     } else {
//         userMsgArray.shift();
//         let userMessage = userMsgArray.join(" ");
//         ctx.sendMessage(userMessage);
//     }
// });

//test command, no practical purpose
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

// bot.command("sma", ctx => {
//     //command use should be: /sma <symb> <timeWindow>
//     //where symb(type: str, required) is the symbol of the given coin
//     //where timeWindow(type: int, required) is how many days it should look back in time
//     let userMsgArray = ctx.message.text.split(" ");
//     // let symb = userMsgArray[1];
//     // let timeWindow = userMsgArray[2];
//     let apiCallUrl = `https://api.polygon.io/v1/indicators/sma/X:BTCUSD?timespan=day&window=1&series_type=close&order=desc&limit=10&apiKey=${process.env.PKEY}`

//     //test call, to see if api key works
//     fetch(apiCallUrl)
//         .then(response => response.json())
//         .then(jsonResponse => {
//             let result = jsonResponse;
            
//             //to access anything in result, use bracket notation like ["results"] instead of dot notation like .results 
//             //this will print the timestamp and value of the first result of the call
//             // console.log(result["results"]["values"][0]["timestamp"]);
//             // console.log(result["results"]["values"][0]["value"]);

//             //shows the amount of values
//             // console.log(result["results"]["values"].length);
//         });


// });

// bot.command("alist", ctx => {
//     //command use: /alist <limit> <sort> <order> <meta>
//     //where
// })

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
        let messageTemplate = `Your remaining LCW API credits: ${result["dailyCreditsRemaining"]} out of ${result["dailyCreditsLimit"]}`;

        ctx.sendMessage(messageTemplate);
    });
});

// bot.command("in", ctx => {
//     let userMsgArray = ctx.message.text.split(" ");
//     let messageTemplate = "";
//     let userInput = parseFloat(userMsgArray[1]);

//     if(userMsgArray.length == 1) {
//         ctx.sendMessage("Command incomplete, correct command usage: \"/in 10\" ");
//     } else {
//         if(isNaN(userInput)) {
//             ctx.sendMessage(`That's not a valid number, try again`);
//         } else {
//             userInput == 1 ? messageTemplate += `${userInput} inch is equal to:` : messageTemplate += `${userInput} inches are equal to:`
//             messageTemplate += `\n• ${userInput * 2.54 } centimeters, \n• ${userInput * 0.0254 } meters`;
    
//             ctx.sendMessage(messageTemplate, {
//                 parse_mode: "HTML"
//             });
//         }
//     }
// });

// bot.command("ft", ctx => {
//     let userMsgArray = ctx.message.text.split(" ");
//     let messageTemplate = "";
//     let userInput = parseFloat(userMsgArray[1]);

//     if(userMsgArray.length == 1) {
//         ctx.sendMessage("Command incomplete, Correct command usage: \"/in 10\" ");
//     } else {
//         if(isNaN(userInput)) {
//             ctx.sendMessage(`That's not a valid number, try again`);
//         } else {
//             userInput == 1 ? messageTemplate += `${userInput} inch is equal to:` : messageTemplate += `${userInput} inches are equal to:`
//             messageTemplate += `\n• ${userInput * 30.48 } centimeters, \n• ${userInput * 0.3048 } meters, \n• ${userInput * 12 } inches`;
    
//             ctx.sendMessage(messageTemplate, {
//                 parse_mode: "HTML"
//             });
//         }
//     }
// });

bot.command("check", ctx => {
    let userMsgArray = ctx.message.text.split(" ");
    
    let messageTemplate = "";

    if(userMsgArray.length == 1) {
        ctx.sendMessage("Missign argument: code. Correct command usage: \"/check BTC\"");
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
            let messageTemplate = `${result["name"]} (${userInput.toUpperCase()})\n$Priced at $${result["rate"]}\nAs of: ${new Date}`;
            ctx.sendMessage(messageTemplate);
        });
    }

});

bot.command("emo", ctx => {
    ctx.sendMessage("e");
})

bot.launch();
// const bot = createBot();

const {Telegraf} = require("telegraf");
const bot = new Telegraf("Not uploading my key lol");

//should be displayed when user types /help
//its empty for now, since, again, i don't know what to put there
// const helpMessage = "";

console.log("Bot is now running...");

//both of these are failed attempts at getting the key from another file, might delete them later
// async function getKeys(){
//     try {
//         telegramKey = await fs.readFile("./tKey.txt", {encoding: "utf8"});
//     } catch(err) {
//         console.log("something got fucked up: " + err);
//     }
// }

// async function createBot(){
//     try {
//         const fs = require("fs/promises");
//         const {Telegraf} = require("telegraf");
//         const telegramKey = await fs.readFile("./tKey.txt", {encoding: "utf8"});
//         const bot = new Telegraf(telegramKey);
//     } catch(err) {
//         console.log("there's been a fucky wucky!: " + err);
//     }
//     return bot;
// }


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
        ctx.sendMessage("You didn't follow proper syntax, use: /rng <whole_number>");
    }
})

bot.command("whoyou", ctx =>{
    ctx.sendMessage("I'm " + ctx.botInfo.first_name + "!");
});

bot.command("whome", ctx =>{
    ctx.sendMessage("You're " + ctx.update.message.from.username + "!");
});

//note to myself, telegram is not like discord so if you want to handle arguments in commands, you'll have to do something like this
//separate the user's text into an array, where index 0 will be the /command itself, and from index 1 onwards are the "parameters" for the command
bot.command("say", ctx =>{
    let userMsgArray = ctx.message.text.split(" ");

    if(userMsgArray.length == 1){
        ctx.sendMessage("Say what? Use: /say <whatever>");
    } else {
        userMsgArray.shift();
        let userMessage = userMsgArray.join(" ");
        ctx.sendMessage(userMessage);
    }
});


bot.launch();
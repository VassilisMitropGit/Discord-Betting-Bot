console.log('zonk'); //once upon a time...

//Required files
const dotenv = require("dotenv").config();
const fs = require("fs");
const Discord = require('discord.js');
const botconfig = require("./botconfig.json");

//Define Discord.Client
const bot = new Discord.Client();

//Login using the unique bot token
bot.login(process.env.BOT_TOKEN);

//Define commands & bot name aliases
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

//Parse commands
fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0){
        console.log("No commands found");
        return;
    }

    //Load each available command
    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        })
    })
})

//Bot ready check
bot.on('ready', async () => {
    console.log('bot is ready');
})

bot.on('message', async message => {
    
    //Set prefix
    let prefix = botconfig.prefix;

    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd;
    cmd = args.shift().toLowerCase();
    let command;
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

    //Run command
    if(bot.commands.has(cmd)){
        command = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)){
        command = bot.commands.get(bot.aliases.get(cmd));
    }
    try{
        command.run(bot, message, args);
    } catch (e){
        return;
    }
})
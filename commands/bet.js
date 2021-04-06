const treasury = require("../treasury.json");
const Discord = require("discord.js");
const fs = require("fs");
const money = require("../money.json");

module.exports.run = async (bot, message, args) => {

    if(!money[message.author.id] || money[message.author.id].money <= 0) return message.reply("no money");

    if(!args[0]) return message.reply("please specify a bet");

    if(isNaN(args[0])) return message.reply("Enter money please");

    try{
        var user_bet = parseFloat(args[0]);
        var user_prediction = args[1];
    } catch{
        return message.reply("you can only enter whole numbers. Or you didn't even enter a number...");
    }

    if(user_bet != Math.floor(user_bet)) return message.reply("you can only enter whole numbers. Or you didn't even enter a number...");

    if(money[message.author.id].money < user_bet) return message.reply("you don't have that much money.");

    if(!treasury[message.author.id]){
        treasury[message.author.id] = {
            name: bot.users.cache.get(message.author.id).tag,
            bet: user_bet,
            prediction: user_prediction
        }
        fs.writeFile("./treasury.json", JSON.stringify(treasury), (err) => {
            if(err) console.log(err);
        });
        money[message.author.id].money -= user_bet;
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
        return message.reply(`you betted $${user_bet} to option '${user_prediction}'.`)
    } else if(treasury[message.author.id].prediction != user_prediction){
        return message.reply("you have already voted the other choice!");
    } else{
        treasury[message.author.id].bet += user_bet;
        fs.writeFile("./treasury.json", JSON.stringify(treasury), (err) => {
            if(err) console.log(err);
        });
        money[message.author.id].money -= user_bet;
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
        return message.reply(`you upped your prediction by $${user_bet}, for a total of ${treasury[message.author.id].bet}!`)
    }
}

module.exports.help = {
    name: "bet",
    aliases: []
}
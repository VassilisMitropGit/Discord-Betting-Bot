const treasury = require("../treasury.json");
const Discord = require("discord.js");
const fs = require("fs");
const money = require("../money.json");

module.exports.run = async (bot, message, args) => {

    if(!args[0]) return message.reply("please specify who won");
    var winner = args[0];
    var winning_players = 0;
    var total_players = 0;
    var winners = [];

    for(var attributename in treasury){
        if(treasury[attributename].prediction === winner){
            winning_players += 1;
            winners.push(treasury[attributename]);
        }
        total_players += 1;
    }

    if(winning_players === 0 || total_players === 0) return message.reply("No players found!");

    for(var i in money){
        for(var j in winners){
            if(money[i].id === winners[j].id){
                money[i].money += winners[j].bet * Math.floor(total_players / winning_players);
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if(err) console.log(err);
                });
            }
        }
    }

    fs.writeFile('./treasury.json', '{}', function(){console.log('done')})

    return message.reply("Winners just got paid! EZ Clap");
}

module.exports.help = {
    name: "payout",
    aliases: []
}
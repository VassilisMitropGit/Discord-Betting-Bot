const Discord = require("discord.js");
const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");

//Connect to the database
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Models
const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {

    if(!args[0]) return message.reply("please specify who won");
    var winner = args[0];
    var winning_players = 0;
    var total_players = 0;

    Data.find({ 
        prediction: { $ne: null }
    }, (err, data) => {
        if (err) console.log(err);
        if (data){
            for (var t in data){
                data[t].currentbet = 0;
                data[t].prediction = "";
                data[t].save().catch(err => console.log(err));
            }
        }
    }).countDocuments(function(err, count){ total_players = count; });

    Data.find({ prediction: winner }).countDocuments(function(err, count){ winning_players = count; });

    Data.find({
        prediction: winner
    }, (err, data) => {
        if (err) console.log(err);
        if (!data) return message.reply("Literally noone won...");

        var multiplier = Math.round(total_players/winning_players);

        for (var w in data){
            data[w].money += data[w].currentbet * multiplier;
            data[w].currentbet = 0;
            data[w].prediction = "";
            data[w].save().catch(err => console.log(err));
        }
        return message.reply("Winners just got paid! EZ Clap");
    })
}

module.exports.help = {
    name: "payout",
    aliases: []
}
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
    var income = 0;

    Data.find({prediction: { $ne: "" }}).countDocuments(function(err, count){ total_players = count; });

    Data.find({ prediction: winner }).countDocuments(function(err, count){ winning_players = count; });

    Data.find({
        prediction: winner
    }, (err, data) => {
        if (err) console.log(err);
        if (!data.length) return message.reply("Literally noone won...");

        var multiplier = total_players/winning_players;
        console.log(multiplier);

        for (var w in data){
            income = data[w].currentbet * multiplier;
            console.log(income);
            let income_fixed = income.toFixed(2);
            console.log(income_fixed);
            let income_fixed_num = parseFloat(income_fixed);
            console.log(income_fixed_num);
            data[w].money += income_fixed_num;
            data[w].currentbet = 0;
            data[w].prediction = "";
            data[w].save().catch(err => console.log(err));
        }

        Data.find({ 
            prediction: { $ne: "" }
        }, (err, data) => {
            if (err) console.log(err);
            if (data.length){
                for (var t in data){
                    data[t].currentbet = 0;
                    data[t].prediction = "";
                    data[t].save().catch(err => console.log(err));
                }
            }
        });

        return message.reply("Winners just got paid! EZ Clap");
    })
}

module.exports.help = {
    name: "payout",
    aliases: []
}
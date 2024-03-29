const Discord = require("discord.js");
const ms = require("parse-ms");
const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");

//Connect to the database
mongoose.connect(process.env.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Models
const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {
    let timeout = 86400000;
    let reward = 100;

    Data.findOne({
        userID: message.author.id
    }, (err, data) => {
        if (err) console.log(err);
        if (!data) {
            const newData = new Data({
                name: message.author.username,
                userID: message.author.id,
                lb: "all",
                money: reward,
                daily: Date.now()
            })
            newData.save().catch(err => console.log(err));
            return message.channel.send(`${message.author.username} has $${reward}.`);
        } else{
            if(timeout - (Date.now() - data.daily) > 0){
                let time = ms(timeout - (Date.now() - data.daily));

                return message.reply(`You already collected your reward! ~skrrt~ Collect again in ${time.hours}h ${time.minutes}m ${time.seconds}s`);
            } else{
                data.money += reward;
                data.daily = Date.now();
                data.save().catch(err => console.log(err));

                return message.reply(`You collected your daily reward of $${reward}. Current balance is $${data.money}.`);
            }
        }
    })
}

module.exports.help = {
    name: "daily",
    aliases: []
}
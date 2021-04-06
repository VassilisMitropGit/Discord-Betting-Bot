// const fs = require("fs");
// const money = require("../money.json");
const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");

//connect to database
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true
});

//models
const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {
    if(!args[0]){
        var user = message.author;
    } else {
        var user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    }

    Data.findOne({
        userID: user.id
    }, (err, data) => {
        if (err) console.log(err);
        if (!data) {
            const newData = new Data({
                name: bot.users.cache.get(user.id).username,
                userID: user.id,
                lb: "all",
                money: 0,
                daily: 0
            })
            newData.save().catch(err => console.log(err));
            return message.channel.send(`${bot.users.cache.get(user.id).username} has $0.`);
        } else{
            return message.channel.send(`${bot.users.cache.get(user.id).username} has $${data.money}.`);
        }
    })

    // if(!money[user.id]){
    //     money[user.id] = {
    //         name: bot.users.cache.get(user.id).tag,
    //         money: 0,
    //         id: user.id
    //     }
    //     fs.writeFile("./money.json", JSON.stringify(money), (err) => {
    //         if(err) console.log(err);
    //     });
    // } else{
    //     money[user.id].name = bot.users.cache.get(user.id).tag;
    //     fs.writeFile("./money.json", JSON.stringify(money), (err) => {
    //         if(err) console.log(err);
    //     });
    // }

    // return message.channel.send(`${bot.users.cache.get(user.id).username} has $${money[user.id].money}.`);
}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"]
}
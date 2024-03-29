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
            return message.channel.send(`${bot.users.cache.get(user.id).username} has $0. Gotta start the grind.`);
        } else{
            return message.channel.send(`${bot.users.cache.get(user.id).username} has $${data.money}. SHEEEEEEEEEESH!`);
        }
    })
}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"]
}
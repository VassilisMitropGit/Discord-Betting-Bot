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

    try{
        var user_bet = parseFloat(args[0]);
        var user_prediction = args[1];
    } catch{
        return message.reply("you can only enter whole numbers.");
    }

    if(!args[0]) return message.reply("Please specify a bet");
    if(!args[1]) return message.reply("Please enter a prediction");
    if(isNaN(args[0])) return message.reply("Enter a valid amount of money please");
    //if(user_bet != Math.floor(user_bet)) return message.reply("you can only enter whole numbers.");
    if(user_bet <= 0) return message.reply("Don't try to scam the KoutoukiBooker");


    Data.findOne({
        userID: message.author.id
    }, (err, data) => {
        if (err) console.log(err);
        if (!data) {
            return message.reply("Use z!balance to create an account first!");
        }
        if (data.money <=0 || data.money < user_bet){
            return message.reply(`You don't have enough money for that bet... You currently have $${data.money}.`);
        }

        if (!data.prediction){
            data.money -= user_bet;
            data.prediction = user_prediction;
            data.currentbet = user_bet;
            data.save().catch(err => console.log(err));
            return message.reply(`You just bet $${user_bet} to option '${user_prediction}'. !Elpizoume`);
        } else if (data.prediction != user_prediction){
            return message.reply("You have already voted the other choice or the bet isn't done yet! What a dumbass.");
        } else{
            data.money -= user_bet;
            data.currentbet += user_bet;
            data.save().catch(err => console.log(err));
            return message.reply(`You just upped your prediction by $${user_bet}, for a total of ${data.currentbet}!. All in or no balls.`);
        }
    })
}

module.exports.help = {
    name: "bet",
    aliases: []
}
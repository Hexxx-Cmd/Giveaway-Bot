const Command = require('../structures/command');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');

module.exports = class RerollCommand extends Command {
    constructor(){
        super('reroll', []);
    }
    
    async run(client, message, args) {
        try{
            if(!args[0] || isNaN(args[0])) return await message.channel.send(`Missing argument, giveaway id must be a number.`);

            let giveaway = await db.prepare('SELECT * FROM giveaways WHERE message=?').get(args[0]);
            if(!giveaway) return await message.channel.send(`Invalid giveaway id.`);
            if(giveaway.ended == 'false') return await message.channel.send(`Giveaway is still running.`);
            

            client.emit('giveawayEnd',giveaway,true);
        }catch(err){console.log('[ERROR] - at REROLL', err.stack)}
    }
}
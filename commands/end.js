const Command = require('../structures/command');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');

module.exports = class EndCommand extends Command {
    constructor(){
        super('end', []);
    }
    
    async run(client, message, args) {
        try{
            if(!args[0] || isNaN(args[0])) return await message.channel.send(`You must enter a valid giveaway id.`);
            let giveaway = await db.prepare('SELECT * FROM giveaways WHERE message=?').get(args[0]);
            if(!giveaway) return await message.channel.send(`Not a valid giveaway.`);
            client.emit('giveawayEnd', giveaway);
            await message.channel.send(`Giveaway ended!`);
        }catch(err){console.log('[ERROR] - at GEND', err.stack)}
    }
}
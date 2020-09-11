const Command = require('../structures/command');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');
let filter;

module.exports = class StartCommand extends Command {
    constructor(){
        super('start', ['create']);
    }
    
    async run(client, message, args) {
        if(!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send(`Invalid permission, you are required to have \`MANAGE_GUILD\` permission.`);
        filter = m => m.author.id === message.author.id
        let channel = await data(message, 'Mention the channel you want giveaway in:');
        if(!channel.mentions.channels.first()) return message.reply(`Invalid channel mention.`);

        let time = await data(message, 'Please specify the duration of the giveaway: \n*(1h = one hour, 1d = one day/23 hours. Dont enter 1d1h, that won\'t work.)*');
        if(!ms(time.content)) return message.reply(`Invalid duration.`);

        let prize = await data(message, 'What is the reward of the giveaway?');
        if(!prize.content) return message.reply(`You need to specify the reward.`);

        let winners = await data(message, 'How many winner there is?');
        if(isNaN(winners.content)) return message.reply(`The amount of winners must be a number.`);

        let giveaway_embed = new MessageEmbed()
        .setTitle(`🎊 ${winners.content} ${prize.content}`)
        .setDescription(`React with 🎉 to enter!\n\nTime left: **${pretty(ms(time.content))}**\nHosted by: ${message.author}`)
        .setFooter(`Ends at`)
        .setTimestamp(moment(ms(time.content)).format('MM/DD/YYYY hh:mm a'));

        let msg = await message.channel.send('🎉 New giveaway!', {embed: giveaway_embed});
        await msg.react('🎉')
        db.prepare('INSERT INTO giveaways(guild_id,channel,message,creator,reward,amount,start_at,end_at) VALUES(?,?,?,?,?,?,?,?)').run(message.guild.id,channel.mentions.channels.first().id, msg.id, message.author.id, prize.content, parseInt(winners.content), Date.now(), Date.now() + ms(time.content));
        await client.giveaways.push(msg.id);

    }
}

const data = async(message,question) => {
    return new Promise(async(resolve,reject)=>{
        await message.channel.send(question);
        const data = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });
        if(data) resolve(data.first());
    });
}
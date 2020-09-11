const event = require('../structures/event');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');

module.exports = class GiveawayEndEvent extends event {
  constructor() {
    super('giveawayEnd');
  }
  
  async run(client, giveaway, reroll) {
    try {
        if(client.giveaways.includes(giveaway.message)) {
            client.giveaways.splice(client.giveaways.indexOf(giveaway.message),1);
        }
        let message = await client.channels.cache.get(giveaway.channel).messages.fetch(giveaway.message);

        let all = await message.reactions.cache.get('🎉').users.fetch();
        let users = all.filter(u => !u.bot);
        // let random = Math.floor(Math.random() * users.length)

        let user = users.randomUser(giveaway.amount);
        let cache = []
        user.forEach(u=>{
            cache.push(`<@${u}>`)
        });
        let link = `https://discordapp.com/channels/${giveaway.guild_id}/${giveaway.channel}/${giveaway.message}`;
        // add check if user is still in the guild.

        // send winner message & embed.
        let win_message = `${reroll == true ? `**REROLLED**\n` : ''}🎉 Congratulations ${giveaway.amount = 1 ? cache.join("") : cache.join(', ')}, you have won the **${giveaway.reward}** !\n${link}`
        cache.length > 0 ? await message.channel.send(win_message) : `No one entered the giveaway ${link} so noone won.`;
        
        let winner_embed = new MessageEmbed()
        .setTitle(`🎁 ${giveaway.reward}`)
        .setDescription(`${reroll==true ? '**REROLLED**\n' : ''}${giveaway.amount == 1 ? `🎉 Winner: <@${cache.join('')}>` :  `🎉 Winners:\n${cache.join('\n')}`}\n\nHosted by: <@${giveaway.creator}>`).setFooter(`Giveaway ended`).setTimestamp(moment(giveaway.end_at).format('MM/DD/YYYY'));

        cache.length > 0 ? await message.edit(winner_embed) : message.edit({embed: new MessageEmbed().setTitle(`🎁 ${giveaway.reward}`).setDescription(`Noone entered the giveaway - no winners.`).setFooter(`Giveaway ended`).setTimestamp(moment(giveaway.end_at).format('MM/DD/YYYY'))});
        return db.prepare('UPDATE giveaways SET ended=\'true\' WHERE message=?').run(giveaway.message);

    } catch (error) {
        if(error.code == '10008') return db.prepare('DELETE FROM giveaways WHERE message=?').run(giveaway.message);
        else console.log(`[ERROR] - at GiveawayEnd Event\n`, error.stack)
    }  
  }
}

Map.prototype.randomUser = function(amount = 1){
    let array = [];
    let keys = Array.from(this.keys());
    while(array.length < amount) {
        let element = keys[Math.floor(Math.random() * keys.length)];
        if(!array.includes(element)) array.push(element);
    }
    return array
  }
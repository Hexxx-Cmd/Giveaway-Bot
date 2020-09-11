const Command = require('../structures/command');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');

module.exports = class HelpCommand extends Command {
    constructor(){
        super('help', []);
    }
    
    async run(client, message, args) {
        try{
            let array = [];
            let cmds = []
            client.commands.forEach(cmd => {
                if(array.includes(cmd.name)) return
                cmds.push(`**\`${cmd.name}\`**`);
            });

            message.channel.send(`Here are the commands: ${cmds.join(', ')}`)
        }catch(err){console.log('[ERROR] - at help', err.stack)}
    }
}
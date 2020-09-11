const event = require('../structures/event');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');

module.exports = class MessageEvent extends event {
  constructor() {
    super('message');
  }
    async run(client, message) {
        const [cmdName, ...cmdArgs] = message.content
            .slice(client.prefix.length)
            .trim()
            .split(/\s+/);
        const command = client.commands.get(cmdName);
        if(command){
            command.run(client, message, cmdArgs);
        }
    }
}
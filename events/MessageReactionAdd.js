const event = require('../structures/event');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');

module.exports = class MessageReactionAddEvent extends event {
  constructor() {
    super('messageReactionAdd');
  }
  
  async run(client, reaction, user) {

  }
}
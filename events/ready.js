const event = require('../structures/event');
const {db} = require('../structures/database');
const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');

module.exports = class ReadyEvent extends event {
  constructor() {
    super('ready');
  }
  
  async run(client) {
    console.log(`Client logged in as ${client.user.username}!`);
  }
}
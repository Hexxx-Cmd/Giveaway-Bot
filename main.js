require('dotenv').config;
const { Client, MessageEmbed } = require('discord.js');
const path = require('path');
const fs = require('fs').promises;
const event = require('./structures/event');
const command = require('./structures/command');
const {db} = require('./structures/database');

const ms = require('ms');
const moment = require('moment');
const pretty = require('pretty-ms');


class Giveaway extends Client {
    constructor(options){
        super(options)

        this.commands = new Map();
        this.events = new Map();
        this.giveaways = new Array();
        this.prefix = 'g!'

        // this.create();
    }
    
    async registerCommands(dir) {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) this.registerCommands(this, path.join(dir, file));
            if (file.endsWith('.js')) {
                const Command = require(path.join(filePath, file));
                if (Command.prototype instanceof command) {
                    const cmd = new Command();
                    this.commands.set(cmd.name, cmd);
                    await cmd.aliases.forEach((alias) => {
                    this.commands.set(alias, cmd);
                    });
                }
            }
        }
    }

    async registerEvents(dir) {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) this.registerEvents(this, path.join(dir, file));
            if (file.endsWith('.js')) {
                const Event = require(path.join(filePath, file));
                if (Event.prototype instanceof event) {
                    const event = new Event();
                    this.events.set(event.name, event);
                    this.on(event.name, event.run.bind(event, this));
                }
            }
        }
    }

    async create(){
        this.login('NzQ1NTgwNjgzMzMzNzMwMzg2.Xzz2Hw.3wevbOcSbs8-lLAOPnN-9bEwUk8');
        await this.registerCommands('./commands');
        await this.registerEvents('./events');
        this.updateGiveaways();
    }

    updateGiveaways() {
        setInterval(() => {
            let giveaways = db.prepare('SELECT * FROM giveaways WHERE ended=\'false\'').all();

            giveaways.forEach(async giveaway => {
                // console.log(giveaway);
                if(Date.now() >= giveaway.end_at) return  this.emit('giveawayEnd', giveaway);
                if(!client.channels.cache.get(giveaway.channel)) {console.log('giveaway channel wasn\'t found, removing the giveaway.')}
                try {
                    let message = await client.channels.cache.get(giveaway.channel).messages.fetch(giveaway.message);
                    // console.log(message)
                    let giveaway_embed = new MessageEmbed()
                    .setTitle(`🎊 ${giveaway.amount} ${giveaway.reward}`)
                    .setDescription(`React with 🎉 to enter!\n\nTime left: **${pretty(giveaway.end_at-Date.now())}**\nHosted by: <@${giveaway.creator}>`)
                    .setFooter(`Ends at`)
                    .setTimestamp(moment(giveaway.end_at).format('MM/DD/YYYY hh:mm a'));

                    await message.edit(giveaway_embed);
                } catch (error) {
                    if(error.code == '10008') return db.prepare('DELETE FROM giveaways WHERE message=?').run(giveaway.message);
                    else console.log(`Error while updating and checking messages.\n`, error.stack)
                }
                
            });
        }, 5 * 1000);
    }
}

let client = new Giveaway();
client.create();

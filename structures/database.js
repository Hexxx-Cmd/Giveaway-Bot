const database = require('better-sqlite3');
const db = new database(__dirname + '/../data/database.db',{ verbose: console.log });

(async()=>{
    db.prepare('CREATE TABLE IF NOT EXISTS giveaways(id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, channel TEXT, message TEXT, creator TEXT, reward TEXT, amount INT, start_at INT, end_at INT, ended TEXT DEFAULT "false" NOT NULL)').run();
})();

module.exports = {
    db
}
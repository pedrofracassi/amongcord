const Discord = require("discord.js");
const client = new Discord.Client();
let prefix = ","; // get from db or whatever

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    if (message.author.id === client.user.id) return;
    function setMuteState(bool) {
        message.member.voice.channel.members.forEach((m) => {
            if (m.user.bot) return;
            m.voice.setMute(bool).catch(console.log);
        });
    }
    switch (message.content) {
        case `${prefix}mute`:
            setMuteState(true);
            break;
        case `${prefix}unmute`:
            setMuteState(false);
            break;
    }
});

client.login(process.env.DISCORD_TOKEN);

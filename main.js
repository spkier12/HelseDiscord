import * as D from 'discord.js'
import { Logs } from './Logging.js'
import { SendEmbedMenu } from './Commands.js'
import * as fs from 'node:fs/promises';


// Create a new discord client with requested intents for gateway to listen to
const Bot = new D.Client({intents: [
    D.GatewayIntentBits.GuildMembers,
    D.GatewayIntentBits.GuildMessages,
    D.GatewayIntentBits.MessageContent,
    D.GatewayIntentBits.Guilds],
    partials: [D.Partials.Channel, D.Partials.User, D.Partials.Message]
})

// Loads the config and the starts the bot
let Config = JSON.parse(await fs.readFile("Config.json"))
await Startup()
async function Startup() {
    try {
        await Bot.login(Config.Token)
    } catch(e) {
        await Logs(e)
        await Startup()
        return
    }
}

// Once the bot is ready fire of the ready event and logg it
Bot.once(D.Events.ClientReady, async c => {
    await Logs(`${c.user.username} is now ready for use!`)
})

// When a message is received from Guild
Bot.on(D.Events.MessageCreate, async CTX => {
    try {
        if (Bot.user?.id)
        if (CTX.author.id == Bot.user.id) throw("Reply is from bot");
        switch(CTX.content.toUpperCase()) {
            case("11"):
                await SendEmbedMenu(CTX)
                break;
            default:
                break;
        }
    } catch(e) {
        await Logs(e)
        return
    }
})


let TicketCount = 0

Bot.on(D.Events.InteractionCreate, async I => {
    try {

        // Fidn the evryone role id, and catch it.
        const EveryoneRole = I.guild.roles.cache.find(r => r.name == "@everyone")

        // Checks if the interaction is a selectmenu and if the value is equal, create channel.
        if (I.isStringSelectMenu()) {
            console.log(I.values[0])
            const CreatedChannel = I.guild.channels.create({
                name: `-${I.values[0]} ${TicketCount++}}`,
                type: D.ChannelType.GuildText,
                parent: "1139284836574564382",

                permissionOverwrites: [
                    {
                        id: EveryoneRole.id,
                        deny: ['1024']
                    },
                    {
                        id: I.user.id,
                        allow: ['1024']
                    },

                    {
                        id: "1138905077759889501",
                        allow: ['1024']
                    },
                 ]
            });

            // Sends a message to the given channel
            (await CreatedChannel).send({content: `<@${I.user.id}> har opprettet en sak`})
        }

        // Remove interaction error beacuse Henning wanted it...
        I.update({})

        // Calmly exit the function
        return
    } catch(e) {
        await Logs(e)
        return
    }
})
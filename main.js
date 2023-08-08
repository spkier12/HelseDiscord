import * as D from 'discord.js'
import { Logs } from './Logging.js'
import {} from './Commands.js'
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
let Config
await Startup()
async function Startup() {
    try {
        await Bot.login("")
    } catch(e) {
        Config.Debug ? await Logs(e) : false
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
            case("//"):
                break;
            default:
                break;
        }
    } catch(e) {
        Config.Debug ? await Logs(e) : false
        return
    }
})

Bot.on(D.Events.InteractionCreate, async I => {
    try {
        // const Tup = I.message.components[0].components[0]
        // const Tdow = I.message.components[0].components[1]
        
    } catch(e) {
        Config.Debug ? await Logs(e) : false
        return
    }
    
})
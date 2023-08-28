import * as D from 'discord.js'
import { Logs } from './Logging.js'
import { SendEmbedMenu, Close, AddRoleToCase, CreateChannelEmebed } from './Commands.js'
import * as fs from 'node:fs/promises';

// Loads the ticket count from file
let TicketCount = JSON.parse(await fs.readFile("Settings.json")).TicketCount

// Loads the config and the starts the bot
let Config = JSON.parse(await fs.readFile("Config.json"))

// Create a new discord client with requested intents for gateway to listen to
const Bot = new D.Client({intents: [
    D.GatewayIntentBits.GuildMembers,
    D.GatewayIntentBits.GuildMessageReactions,
    D.GatewayIntentBits.GuildMessages,
    D.GatewayIntentBits.MessageContent,
    D.GatewayIntentBits.Guilds],
    partials: [D.Partials.Channel, D.Partials.User, D.Partials.Message]
})


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
            case("SAKSBEHANDLER START490"):
                await SendEmbedMenu(CTX)
                break;
            case("SAKSBEHANDLER STENG"):
                await Close(CTX, Config.DChannel)
                break;
            case("SB STENG"):
                await Close(CTX, Config.DChannel)
                break;
            case("HELSE BISTAND490"):
                break;
            default:
                await AddRoleToCase(CTX, CTX.content)
                break;
        }
    } catch(e) {
        await Logs(e)
        return
    }
})



Bot.on(D.Events.InteractionCreate, async I => {
    try {
        TicketCount++
        // Check if the interaction is a string select menu
        if (I.isStringSelectMenu()) {

            // If the interaction is a string select menu and the custom id is menuSelect then create a channel
            if (I.customId == "menuSelect"){
                await CreateChannelEmebed(I, Config, TicketCount)
            }
        }

        // Save the ticket count to file
        await fs.writeFile("Settings.json", JSON.stringify({"TicketCount": TicketCount+1}))
        await Logs("\nSaving TicketCount")

        // Removes the interaction from the queue so it doesn't get stuck
        I.update({})
    } catch(e) {
        await Logs(e)
        return
    }
})
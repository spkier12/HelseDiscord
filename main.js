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
            case("SAKSBEHANDLER START"):
                await SendEmbedMenu(CTX)
                break;
            case("SAKSBEHANDLER STENG"):
                await Close(CTX, Config.DChannel)
                break;
            case("SB STENG"):
                await Close(CTX, Config.DChannel)
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
        // Get the everyone role from the guild the interaction is from and save it to a variable
        const EveryoneRole = I.guild.roles.cache.find(r => r.name == "@everyone")

        // Check if the interaction is a string select menu
        if (I.isStringSelectMenu()) {

            // If the interaction is a string select menu and the custom id is menuSelect then create a channel
            if (I.customId == "menuSelect"){
                const CreatedChannel = I.guild.channels.create({
                    name: `${I.values[0]} ${TicketCount++}}`,
                    type: D.ChannelType.GuildText,
                    parent: Config.ParentID,
                    permissionOverwrites: [
                        {id: EveryoneRole.id, deny: ['1024']},
                        {id: I.user.id, allow: ['1024']},
                        {id: "1138905077759889501", allow: ['1024']},
                        {id: "222043022450229249", allow: ['1024']},
                     ]
                });

                // Create a embed in the channel that was just created
                await CreateChannelEmebed(I, (await CreatedChannel).id, TicketCount)
            }
        }

        // Save the ticket count to file
        await fs.writeFile("Settings.json", JSON.stringify({"TicketCount": TicketCount}))

        // Removes the interaction from the queue so it doesn't get stuck
        I.update({})
    } catch(e) {
        await Logs(e)
        return
    }
})
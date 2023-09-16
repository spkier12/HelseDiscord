import * as D from 'discord.js'
import { Logs } from './Logging.js'
import * as fs from 'node:fs/promises';


//Send a message to the given channel where a menu of selection
export async function SendEmbedMenu(ctx) {
    const menu = new D.StringSelectMenuBuilder()
    .setCustomId('menuSelect')
    .setPlaceholder('Velg nedenfor for åpne sak')
    menu.addOptions(
        new D.StringSelectMenuOptionBuilder()
            .setLabel("Avvik")
            .setValue("Avvik")
            .setDescription('Rapporter avvik/hendelse'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Tilbakemeldinger/Forslag")
            .setValue("Tilbakemeldinger/Forslag")
            .setDescription('Gi tilbakemelding eller forslag til forbedring'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Uønsket hendelse")
            .setValue("Uønsket hendelse")
            .setDescription(`Uønsket hendelse som har skjedd i helse`),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Intern-søknad")
            .setValue("Intern-søknad")
            .setDescription(`Send søknad her på interne stillinger i helse`),
    )

    const rowmenu = new D.ActionRowBuilder()
        .addComponents(menu);

    // Embed to be above the menu
    const embed = new D.EmbedBuilder()
        .setTitle('SaksBehandler')
        .setDescription('Her kan du opprette en sak for å få hjelp fra en saksbehandler eller klage på en avgjørelse, en ansatt eller annen etat \n\n Velg en av kategoriene under for å opprette en sak')
        .setImage('https://i.imgur.com/8y2xvBL.png')

    // Send to channel
    await ctx.channel.send({
        embeds: [embed],
        components: [rowmenu]
    })
}

//Send a message to the given channel where a menu of selection
export async function SendEmbedMenu1(ctx) {
    const menu = new D.StringSelectMenuBuilder()
    .setCustomId('menuSelect1')
    .setPlaceholder('Velg nedenfor for åpne sak')
    menu.addOptions(
        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Pyskolgisk avdeling")
            .setValue("Pyskolgisk")
            .setDescription('Henvisning til Pyskolgisk avdeling for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Kardiolog")
            .setValue("Kardiolog")
            .setDescription('Henvisning til Kardiolog for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Kirurg")
            .setValue("Kirurg")
            .setDescription('Henvisning til Kirurg for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Anestesi")
            .setValue("Anestesi")
            .setDescription('Henvisning til Anestesi for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Fysioterapeut")
            .setValue("Fysioterapeut")
            .setDescription('Henvisning til Fysioterapeut for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Overlege")
            .setValue("Overlege")
            .setDescription('Henvisning til Overlege for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Lege")
            .setValue("Lege")
            .setDescription('Henvisning til Lege for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Fastlege")
            .setValue("Fastlege")
            .setDescription('Henvisning til Fastlege for behandling'),

        new D.StringSelectMenuOptionBuilder()
            .setLabel("Henvisning til Intern-Testing")
            .setValue("Intern-Testing")
            .setDescription('Henvisning til Intern-Testing for behandling'),
    )

    const rowmenu = new D.ActionRowBuilder()
        .addComponents(menu);

    // Embed to be above the menu
    const embed = new D.EmbedBuilder()
        .setTitle('SaksBehandler Henvisninger')
        .setDescription(`Henvisninger til behandling i helse- og omsorgsdepartementet \n\n Velg en av kategoriene under for å opprette en sak for henvisning til behandling i helse- og omsorgsdepartementet`)
        .setImage('https://i.imgur.com/8y2xvBL.png')

    // Send to channel
    await ctx.channel.send({
        embeds: [embed],
        components: [rowmenu]
    })
}

// Closes the ticket
export async function Close(ctx, DChannel) {
    try {
        if (ctx.channel.parentId != "1139284836574564382") throw("Channel is not a ticket")
        if (ctx.channel.id == DChannel) {
            await ctx.channel.send("Denne kanalen kan ikke slettes, den er ment for å lese tidligere saker.")
            return
        }

        // Find channel by id
        const channel = ctx.guild.channels.cache.get(DChannel)
        // Send file from Memory to channel with content
        await channel.send({files: [`Memory/${ctx.channel.name}.txt`], content: `Saken er nå lukket av ${ctx.author.username}`})


        // Delete Channel
        await ctx.channel.delete()
    } catch (e) {
        await ctx.channel.send({content: "Kunne ikke lukke saken \n du må skrive noe i saken før den kan lukkes"})
        // await ctx.channel.delete()
        await Logs(e)
        return
    }
}

export async function AddRoleToCase(ctx, wrole) {
    try {
        let role = undefined

        const messages = await ctx.content.split(" ")
        // Check if the channel is a ticket
        if (ctx.channel.parentId != "1139284836574564382") throw("Channel is not a ticket")


        // Check if user mentioned a role
        console.log(`\n Mentioned message nr2 ${messages[1]} Replied: ${ctx.reference?.messageId}}`)
        if (messages[1] == undefined) {
            if (ctx.mentions.users.first() && ctx.reference?.messageId == null) {
                role = ctx.mentions.users.first() || ctx.guild.users.cache.find(role => role.name === args.join(" "))
                await AddC()
                return
            }

            if (ctx.mentions.roles.first() && ctx.reference?.messageId == null) {
                role = ctx.mentions.roles.first() || ctx.guild.roles.cache.find(role => role.name === args.join(" "))
                // Get all users in variable role
                const usersWithRole = role.members.map(m => m.user.id);
                console.log(usersWithRole)

                await AddC()
                return
            }
        }
        

        // This function will not run if the user did not mention a role/user or if the role/user does not exist in the guild
        async function AddC() {
            // update channel permissions to allow the role to see the channel
            await ctx.channel.permissionOverwrites.edit(role.id, {"1024": true})

            // Send a message back to channel to let end user know that the role has been added to the ticket channel and that the user now has access to the ticket
            await ctx.channel.send(`*${wrole}* har nå fått innsyn i saken din.`)
        }

        await Logs("Could not find Role/User, perhaps that was intentional Saving content to memory\n")
        await SaveToMemory(ctx)
    } catch (e) {
        await Logs(e)
        return
    }

}

export async function CreateChannelEmebed(I, Config, TicketCount) {
    try {

        // fetch user from guild
        let us = await I.guild.members.fetch(I.user.id)

        // Get the everyone role from the guild the interaction is from and save it to a variable
        const EveryoneRole = I.guild.roles.cache.find(r => r.name == "@everyone")

        // Find nickname of user
        const Nickname = await I.guild.members.fetch(I.user.id)

        switch (I.values[0]) {
            case "Pyskolgisk":
                await CreateChannelEmebednotdefault("890156127512330260")
                break;
            case "Kardiolog":
                await CreateChannelEmebednotdefault("1148665904683556944")
                break;
            case "Kirurg":
                await CreateChannelEmebednotdefault("890156290008031233")
                break;
            case "Anestesi":
                await CreateChannelEmebednotdefault("1093305810009997312")
                break;
            case "Fysioterapeut":
                await CreateChannelEmebednotdefault("1151822294797271060")
                break;
            case "Overlege":
                await CreateChannelEmebednotdefault("882520832671383613")
                break;
            case "Lege":
                await CreateChannelEmebednotdefault("882520835812913173")
                break;
            case "Fastlege":
                await CreateChannelEmebednotdefault("1151877809137008640")
                break;
            case "Intern-Testing":
                await CreateChannelEmebednotdefault("222043022450229249")
                break;
            default:
                const CreatedChannel = I.guild.channels.create({
                    name: `${I.values[0]} ${TicketCount}}`,
                    type: D.ChannelType.GuildText,
                    parent: Config.ParentID,
                    permissionOverwrites: [
                        {id: EveryoneRole.id, deny: ['1024']},
                        {id: I.user.id, allow: ['1024']},
                        {id: "1138905077759889501", allow: ['1024']},
                     ]
                });

                // Create embed and send it to the channel that was created above
                await Createembed(CreatedChannel)
                break;
        }

        // If switch was not default then create the channel with default values
        async function CreateChannelEmebednotdefault(id) {
            const CreatedChannel = I.guild.channels.create({
                name: `${I.values[0]} ${TicketCount}}`,
                type: D.ChannelType.GuildText,
                parent: Config.ParentID,
                permissionOverwrites: [
                    {id: EveryoneRole.id, deny: ['1024']},
                    {id: I.user.id, allow: ['1024']},
                    {id: "1138905077759889501", allow: ['1024']},
                    {id: id, allow: ['1024']},
                 ]
            });

            // Create embed and send it to the channel that was created above
            await Createembed(CreatedChannel)
        }

        // Discord Embed that shows case number and user
        // Stores channel to txt file in Memory folder and appends the file with the content
        async function Createembed(CreatedChannel) {
            console.log(`\nCreate embded start`)
            const Embed = new D.EmbedBuilder()
            .setTitle(`SaksBehandler`)
            .setColor("#ff0000")
            .setDescription(`\n\n
            For å stenge saken skriv    **SAKSBEHANDLER STENG**  Eller  **SB STENG**

            For å inkludere din nærmeste leder, **tag rollen**. Dette gjelder også for å inkl. personer i saken.
            *Direktører og helse- og omsorgsdepartement er automatisk inkludert.*


            -
            \n\n`)
            .addFields(
                {name: `❗️${new Date().toLocaleDateString()}`, value: `${Nickname.displayName} opprettet en sak`, inline: true},
                {name: `❗️SaksNummer`, value: `${I.values[0]}${TicketCount}`, inline: true},
            )

            // Find channel by id and send embed
            await I.guild.channels.cache.get((await CreatedChannel).id).send({embeds: [Embed]})

            // Save ticketcount
            await fs.writeFile("Settings.json", JSON.stringify({"TicketCount": TicketCount+1}))
            await Logs("\nSaving TicketCount")
            await SaveToMemory(I)
            console.log(`\nCreate embded end`)
        }
        
    } catch (e) {
        await Logs(e)
        return
    }
}


// Store messages in memory
async function SaveToMemory(ctx) {
    try {
        // Store ctx.content to file named ctx.channel.name in the folder "Memory" and append the file
        await fs.appendFile(`Memory/${ctx.channel.name}.txt`, `Author: ${ctx.author.username} Message: ${ctx.content}\n`)
        await Logs("Saving to memory")
    } catch (e) {
        await Logs(e)
        return
    }
}
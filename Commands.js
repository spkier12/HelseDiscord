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
            .setLabel("Klage")
            .setValue("Klage")
            .setDescription(`Klage på en avgjørelse, en ansatt eller annen etat`),
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
        await channel.send({files: [`Memory/${ctx.channel.name}.ulrik`], content: `Saken er nå lukket av ${ctx.author.username}`})


        // Delete Channel
        await ctx.channel.delete()
    } catch (e) {
        await ctx.channel.send({content: "Kunne ikke lukke saken"})
        await Logs(e)
        return
    }
}

export async function AddRoleToCase(ctx, wrole) {
    try {
        let role = undefined
        // Check if the channel is a ticket
        if (ctx.channel.parentId != "1139284836574564382") throw("Channel is not a ticket")

        // Check if user mentioned a role
        if (ctx.mentions.users.first()) {
            role = ctx.mentions.users.first() || ctx.guild.users.cache.find(role => role.name === args.join(" "))
            await AddC()
            return
        }

        if (ctx.mentions.roles.first()) {
            role = ctx.mentions.roles.first() || ctx.guild.roles.cache.find(role => role.name === args.join(" "))
            await AddC()
            return
        }

        // This function will not run if the user did not mention a role/user or if the role/user does not exist in the guild
        async function AddC() {
            // update channel permissions to allow the role to see the channel
            await ctx.channel.permissionOverwrites.edit(role.id, {"1024": true})

            // Send a message back to channel to let end user know that the role has been added to the ticket channel and that the user now has access to the ticket
            await ctx.channel.send(`${wrole} har nå fått innsyn i saken din.`)
        }

        await Logs("Could not find Role/User, perhaps that was intentional Saving content to memory\n")
        await SaveToMemory(ctx)
    } catch (e) {
        await Logs(e)
        return
    }

}

export async function CreateChannelEmebed(I, NewCC, TicketCount) {
    try {
        // Discord Embed that shows case number and user
        const Embed = new D.EmbedBuilder()
            .setTitle(`SaksBehandler`)
            .setColor("#ff0000")
            .setDescription(`\n\n
            For å stenge saken skriv    **SAKSBEHANDLER STENG**  Eller  **SB STENG**

            For å inkludere din nærmeste leder, **tag rollen**. Dette gjelder også for å inkl. personer i saken.
            Direktører og helse- og omsorgsdepartement er automatisk inkludert.


            -
            \n\n`)
            .addFields(
                {name: `❗️${new Date().toLocaleDateString()}`, value: `${I.user.username} opprettet en sak`, inline: true},
                {name: `❗️SaksNummer`, value: `${I.values[0]}${TicketCount -1}`, inline: true},
            )

        // Find channel by id and send embed
        await I.guild.channels.cache.get(NewCC).send({embeds: [Embed]})

    } catch (e) {
        await Logs(e)
        return
    }
}

// Store messages in memory
async function SaveToMemory(ctx) {
    try {
        // Store ctx.content to file named ctx.channel.name in the folder "Memory" and append the file
        await fs.appendFile(`Memory/${ctx.channel.name}.ulrik`, `Author: ${ctx.author.username} Message: ${ctx.content}\n`)
    } catch (e) {
        await Logs(e)
        return
    }
}
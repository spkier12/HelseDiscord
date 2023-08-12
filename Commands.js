import * as D from 'discord.js'
import { Logs } from './Logging.js'


//Send a message to the given channel where a menu of selection
export async function SendEmbedMenu(ctx) {
    const menu = new D.StringSelectMenuBuilder()
    .setCustomId('menuSelect')
    .setPlaceholder('Velg nedenfor for åpne sak')
    menu.addOptions(
        new D.StringSelectMenuOptionBuilder()
            .setLabel("Avvik")
            .setValue("Avvik")
            .setDescription('Rapporter Avik/hendelse'),

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
        .setImage('https://i.imgur.com/xgZvWwl.png')

    // Send to channel
    await ctx.channel.send({
        embeds: [embed],
        components: [rowmenu]
    })
}

// Closes the ticket
export async function Close(ctx) {
    try {
        if (ctx.channel.parentId != "1139284836574564382") throw("Channel is not a ticket")
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
            await ctx.channel.send(`${wrole} Har nå tilgang til saken din.`)
        }

        throw("Could not find Role/User, perhaps that was intentional")
    } catch (e) {
        await Logs(e)
        return
    }

}

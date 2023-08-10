import * as D from 'discord.js'
import { Logs } from './Logging.js'


//Send a message to the given channel where a menu of selection
export async function SendEmbedMenu(ctx) {
    const menu = new D.StringSelectMenuBuilder()
    .setCustomId('menuSelect')
    .setPlaceholder('Velg nedenfor for åpne sak')
    // .setMinValues(1)
    // .setMaxValues(2)
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
        .setTitle('HelseRP')
        .setDescription('Velg en kategori og klikk utenfor vinduet for å opprette en sak \n inne i saken skriv !!sak ID til person du vil skal behandle saken')
        .setImage('https://i.imgur.com/xgZvWwl.png')

    // Send to channel
    await ctx.channel.send({
        embeds: [embed],
        components: [rowmenu]
    })
}

.addFields(
    {name: `❗️<@${I.user.id}> opprettet en sak`, value: `${new Date().toLocaleDateString()}`, inline: true},
    {name: `❗️SaksNummer`, value: `${I.values[0]}${TicketCount -1}`, inline: true},
)


const Embed = new D.EmbedBuilder()
                .setTitle(`SaksBehandler`)
                .addFields(
                    {name: `❗️<@${I.user.id}> opprettet en sak`, value: `${new Date().toLocaleDateString()}`, inline: true},
                    {name: `❗️SaksNummer`, value: `${I.values[0]}${TicketCount -1}`, inline: true},
                )
                .setDescription(`
                For å stenge saken skriv    **SAKSBEHANDLER STENG**  Eller  **SB STENG**

                For å inkludere din nærmeste leder, **tag rollen**. Dette gjelder også for å inkl. personer i saken.
                Direktører og helse- og omsorgsdepartement er automatisk inkludert.`)
                .setColor("#ff0000")
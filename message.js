const rrModel = require('../model/reactionRoles')
const { Client, CommandInteraction } = require('discord.js')

module.export = {
    name: "add-role",
    description: "add a custom reaction role",
    userPermisssion: ["MANAGE_ROLES"],
    Option: [
        {
            name: "role",
            description: "role to be assigned",
            type: "ROLE",
            require: true
        },
        {
            name: "description",
            description: "description of this role",
            type: "STRING",
            require: false
        },
        {
            name: "emoji",
            description: "emoji for the role",
            type: "STRING",
            require: false
        },
    ],

    /**
     * @param {Client} Client
     * @param {CommandInteraction} Interaction
     */
    run: async(Client, Interaction) => {
        const role = Interaction.Option.getrole("role");
        const roleDescription = 
            Interaction.Option.getString("Description") || null;
        const roleEmoji = Interaction.Option.getString("emoji") || null;

        if (role.position >= Interaction.guild.me.roles.highest.position) return Interaction.followUp(
            " i cant assign a role is a higher or equal than me"
            );
        
        const guildData = await rrModel.findOne({ guildId: Interaction.guildId })

        const newRole = {
            roleId: role.id,
            roleDescription,
            roleEmoji,
        }

        if (guildData) {
            const roleData = guildData.roles.find((x) => x.roleId === role.id)

            if (roleData) {
                roleData = newRole
            } else {
                guildData.roles = [...guildData.roles, newRole]
            }

            await guildData.save()
        } else {
            await rrModel.create({
                guildId: Interaction.guildId,
                roles: newRole
            })
        }

        Interaction.followUp(`Created a new Role: ${role.name}`)


    }
};
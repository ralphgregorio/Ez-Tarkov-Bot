import { Command } from "../types";

export default new Command({
    name: "ping",
    description: "replies with pong",
    run: async ({ interaction }) => {
        interaction.followUp("Pong3");
        console.log('Is this working?')
    }
});
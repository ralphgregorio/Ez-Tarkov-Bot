import { CommandType, ExtendedInteraction } from "./type/Command";

export { ExtendedInteraction };

export class Command {
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions);
    }
};
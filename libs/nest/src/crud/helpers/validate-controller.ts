import { ClassType } from '../interfaces/class.interface';

export function validateController(target: ClassType) {
    const hasService = !!target.prototype.service;

    if (!hasService) {
        throw new Error(`Please provide a service for \`${target.name}\``);
    }
}

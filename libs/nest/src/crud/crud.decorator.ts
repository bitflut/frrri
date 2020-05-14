export function Crud(options: any = {}) {
    return function (target: new (...args: any[]) => any) {
        // options = {
        //     ...options,
        // };

        // const hasService = !!target.prototype.service;
        // if (!hasService) {
        //     throw new Error(`Please provide a service for \`${target.constructor.name}\``);
        // }

        // target.prototype.getManyBase = () => { };
    };
}

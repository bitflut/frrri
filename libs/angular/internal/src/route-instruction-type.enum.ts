export enum RouteInstructionType {
    /** Uses getMany */
    GetMany = 'getMany',
    /** Uses getOne */
    GetOne = 'getOne',
    /** Uses getActive */
    GetActive = 'getActive',
    /** Uses deactivate */
    Deactivate = 'deactivate',
    /** Sets populate instruction */
    Populate = 'populate',
    /** Resets this state and all its children */
    Reset = 'reset',
    /** Sets meta instruction */
    Meta = 'meta',
}

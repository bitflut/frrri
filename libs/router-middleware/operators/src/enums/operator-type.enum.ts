export enum OperatorType {
    // Crud
    GetActive = 'getActive',
    GetMany = 'getMany',
    GetOne = 'getOne',
    Populate = 'populate',
    Reset = 'reset',

    // Selection
    Deselect = 'deselect',
    Select = 'select',

    // Breadcrumbs
    ActiveBreadcrumb = 'activeBreadcrumb',
    StaticBreadcrumb = 'staticBreadcrumb',

    // Meta
    ActiveMeta = 'activeMeta',
    StaticMeta = 'staticMeta',
}

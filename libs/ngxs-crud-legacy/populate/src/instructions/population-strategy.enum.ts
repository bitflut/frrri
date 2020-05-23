export enum PopulationStrategy {
    /** Own id found on foreign entity (`ForeignEntity[idPath] = ThisEntity.id`) */
    ForeignId = 'foreignId',
    /** Foreign id(s) found on this entity (`ForeignEntity[id] = ThisEntity[idPath]`) */
    Id = 'id',
}

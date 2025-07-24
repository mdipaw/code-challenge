import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({tableName: 'resource'})
export class ResourceEntity {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;
}
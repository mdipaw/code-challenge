import { EntityManager } from '@mikro-orm/core';
import { ResourceEntity } from '../entities/resource.entity';

export class ResourceService {
    constructor(private readonly em: EntityManager) {}

    public async create(data: { name: string }): Promise<ResourceEntity> {
        const resource = new ResourceEntity();
        resource.name = data.name;

        await this.em.persistAndFlush(resource);
        return resource;
    }

    public async delete(id: number): Promise<boolean> {
        const resource = await this.em.findOne(ResourceEntity, id);
        if (!resource) return false;

        await this.em.removeAndFlush(resource);
        return true;
    }

    public async findAll(options?: {
        page?: number;
        limit?: number;
        orderBy?: keyof ResourceEntity;
        order?: 'ASC' | 'DESC';
    }) {
        const { page, limit, orderBy = 'id', order = 'ASC' } = options || {};

        const orderClause = { [orderBy]: order.toLowerCase() };

        if (page && limit) {
            const [items, total] = await this.em.findAndCount(ResourceEntity, {}, {
                limit,
                offset: (page - 1) * limit,
                orderBy: orderClause,
            });

            return {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }

        const items = await this.em.find(ResourceEntity, {}, { orderBy: orderClause });
        return { items, total: items.length };
    }

    public async findById(id: number): Promise<ResourceEntity | null> {
        return await this.em.findOne(ResourceEntity, id);
    }

    public async update(id: number, data: { name: string }): Promise<ResourceEntity | null> {
        const resource = await this.findById(id);
        if (!resource) return null;

        resource.name = data.name;
        await this.em.flush();
        return resource;
    }
}
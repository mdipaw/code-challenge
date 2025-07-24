import { ResourceService } from './resource.service';
import { EntityManager } from '@mikro-orm/core';
import { ResourceEntity } from '../entities/resource.entity';

describe('ResourceService', () => {
    let em: jest.Mocked<EntityManager>;
    let service: ResourceService;

    beforeEach(() => {
        em = {
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            flush: jest.fn(),
        } as any;

        service = new ResourceService(em);
    });

    it('should create a new resource', async () => {
        const result = await service.create({ name: 'Test Resource' });

        expect(em.persistAndFlush).toHaveBeenCalled();
        expect(result.name).toBe('Test Resource');
    });

    it('should delete an existing resource', async () => {
        const mockResource = { id: 1, name: 'To Delete' } as ResourceEntity;
        em.findOne.mockResolvedValue(mockResource);

        const result = await service.delete(1);

        expect(em.removeAndFlush).toHaveBeenCalledWith(mockResource);
        expect(result).toBe(true);
    });

    it('should not delete if resource not found', async () => {
        em.findOne.mockResolvedValue(null);

        const result = await service.delete(999);

        expect(result).toBe(false);
    });

    it('should return all resources without pagination', async () => {
        const mockResources = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] as ResourceEntity[];
        em.find.mockResolvedValue(mockResources);

        const result = await service.findAll();

        expect(result.items.length).toBe(2);
        expect(result.total).toBe(2);
    });

    it('should return paginated resources', async () => {
        const mockResources = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] as ResourceEntity[];
        em.findAndCount.mockResolvedValue([mockResources, 10]);

        const result = await service.findAll({ page: 1, limit: 2 });

        expect(result.items.length).toBe(2);
        expect(result.total).toBe(10);
        expect(result.totalPages).toBe(5);
    });

    it('should find by id', async () => {
        const mockResource = { id: 1, name: 'Found' } as ResourceEntity;
        em.findOne.mockResolvedValue(mockResource);

        const result = await service.findById(1);

        expect(result?.name).toBe('Found');
    });

    it('should return null if not found by id', async () => {
        em.findOne.mockResolvedValue(null);

        const result = await service.findById(999);

        expect(result).toBeNull();
    });

    it('should update a resource', async () => {
        const mockResource = { id: 1, name: 'Old Name' } as ResourceEntity;
        em.findOne.mockResolvedValue(mockResource);

        const result = await service.update(1, { name: 'New Name' });

        expect(em.flush).toHaveBeenCalled();
        expect(result?.name).toBe('New Name');
    });

    it('should return null if update target not found', async () => {
        em.findOne.mockResolvedValue(null);

        const result = await service.update(999, { name: 'Anything' });

        expect(result).toBeNull();
    });
});

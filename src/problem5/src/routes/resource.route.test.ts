import express, { Express } from 'express';
import request from 'supertest';
import routeResource from '../routes/resource.route';
import { services as ServicesType } from '../services';

const mockServices: ServicesType = {
    resourceService: {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

let app: Express;

beforeEach(() => {
    app = express();
    app.use(express.json());
    routeResource(app, mockServices);
    jest.clearAllMocks();
});

describe('Resource Routes', () => {
    describe('POST /', () => {
        it('should create a resource', async () => {
            mockServices.resourceService.create.mockResolvedValue({ id: 1, name: 'Test' });

            const res = await request(app).post('/').send({ name: 'Test' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: 1, name: 'Test' });
            expect(mockServices.resourceService.create).toHaveBeenCalledWith({ name: 'Test' });
        });

        it('should return 400 if name is invalid', async () => {
            const res = await request(app).post('/').send({ name: '' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /', () => {
        it('should return all resources', async () => {
            mockServices.resourceService.findAll.mockResolvedValue([{ id: 1, name: 'Foo' }]);

            const res = await request(app).get('/');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 1, name: 'Foo' }]);
        });
    });

    describe('GET /:id', () => {
        it('should return resource by id', async () => {
            mockServices.resourceService.findById.mockResolvedValue({ id: 1, name: 'Test' });

            const res = await request(app).get('/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: 1, name: 'Test' });
        });

        it('should return 400 for invalid id', async () => {
            const res = await request(app).get('/abc');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 404 if not found', async () => {
            mockServices.resourceService.findById.mockResolvedValue(null);

            const res = await request(app).get('/999');

            expect(res.status).toBe(404);
        });
    });

    describe('PUT /:id', () => {
        it('should update resource', async () => {
            mockServices.resourceService.update.mockResolvedValue({ id: 1, name: 'Updated' });

            const res = await request(app).put('/1').send({ name: 'Updated' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: 1, name: 'Updated' });
        });

        it('should return 400 for invalid id or name', async () => {
            const res1 = await request(app).put('/abc').send({ name: 'Name' });
            const res2 = await request(app).put('/1').send({ name: '' });

            expect(res1.status).toBe(400);
            expect(res2.status).toBe(400);
        });

        it('should return 404 if not found', async () => {
            mockServices.resourceService.update.mockResolvedValue(null);

            const res = await request(app).put('/1').send({ name: 'New' });

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /:id', () => {
        it('should delete resource', async () => {
            mockServices.resourceService.delete.mockResolvedValue(true);

            const res = await request(app).delete('/1');

            expect(res.status).toBe(204);
        });

        it('should return 400 for invalid id', async () => {
            const res = await request(app).delete('/abc');

            expect(res.status).toBe(400);
        });

        it('should return 404 if not found', async () => {
            mockServices.resourceService.delete.mockResolvedValue(false);

            const res = await request(app).delete('/999');

            expect(res.status).toBe(404);
        });
    });
});

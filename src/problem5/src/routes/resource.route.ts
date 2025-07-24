import { Router, Request, Response, IRouter } from 'express';
import { services } from '../services';

const resourceRoute = (router: IRouter, services: services): Router => {
    router.post('/', async (req: Request, res: Response) => {
        const { name } = req.body;
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required and must be a string' });
        }

        try {
            const created = await services.resourceService.create({ name });
            res.status(201).json(created);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/', async (req: Request, res: Response) => {
        try {
            const all = await services.resourceService.findAll();
            res.json(all);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        try {
            const data = await services.resourceService.findById(id);
            if (!data) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.put('/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required and must be a string' });
        }

        try {
            const updated = await services.resourceService.update(id, { name });
            if (!updated) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.delete('/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        try {
            const deleted = await services.resourceService.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};

export default resourceRoute;

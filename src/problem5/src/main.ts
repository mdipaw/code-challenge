import {app} from './app';

const PORT = process.env.PORT || 3000;
(async ()=> {
   const server = await app()
       server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})()
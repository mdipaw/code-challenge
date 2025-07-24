import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
    allowGlobalContext: true,
    entities: ['./dist/entities/*.entity.js'],
    entitiesTs: ['./src/entities/*.entity.ts'],
    dbName: 'app_db',
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
        disableForeignKeys: false,
    },
    extensions: [Migrator],
});

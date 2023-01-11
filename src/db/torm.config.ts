import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { DataSource } from "typeorm";



export const pgConnectionOptions: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/features/entities/entities/*.entity{.ts,.js}'],
    migrations: ["src/db/migrations/**"],
    synchronize: false,
    logging: false
};

export default new DataSource(pgConnectionOptions)
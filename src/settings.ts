import * as dotenv from "dotenv";

dotenv.config();

const settings = {
    environment: process.env.NODE_ENV || 'development',
    server: {
        scheme: process.env.SCHEME || "http",
        host: process.env.HOST || "0.0.0.0",
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    api: {
        adminToken: process.env.ADMIN_API_TOKEN,
    }
} 

export default settings;
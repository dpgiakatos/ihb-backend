export default () => {
    const signingSecret = process.env.SIGNING_SECRET;
    const databasePassword = process.env.DATABASE_PASSWORD;
    if (!signingSecret) {
        throw new Error('No SIGNING_SECRET value found in environment');
    }
    if (!databasePassword) {
        throw new Error('No DATABASE_PASSWORD value found in environment');
    }

    return {
        apiUrl: 'https://internationalhealthbooklet.tech/api',
        frontendUrl: 'https://internationalhealthbooklet.tech/',
        databasePassword,
        signingSecret,
        redisOptions: {
            host: 'localhost',
            port: 6379
        }
    };
}


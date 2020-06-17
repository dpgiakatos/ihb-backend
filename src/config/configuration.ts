export default async () => {

    let envConfiguration;
    if (process.env.NODE_ENV === 'production') {
        envConfiguration = (await import('./production.configuration')).default();
    } else {
        envConfiguration = (await import('./development.configuration')).default;
    }
    return {
        production: process.env.NODE_ENV === 'production',
        port: Number(process.env.PORT) || 3000,
        ...envConfiguration,
    };
}

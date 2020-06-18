module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.DATABASE_PASSWORD,
  database: 'ihb',
  entities: ['dist/**/*.entity{.ts,.js}'],
  subscribers: ['dist/**/*.typeorm-subscriber{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: false,
  cli: {
    migrationsDir: 'src/migrations'
  }
}

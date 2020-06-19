import { Module, ClassSerializerInterceptor, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';
import { isUnique } from './helpers/unique.decorator';
import { OnValidationSubscriber } from './helpers/validation.typeorm-subscriber';
import { MailerModule } from '@nestjs-modules/mailer';
import { DoctorModule } from './app/doctor/doctor.module';
import { ModuleRef, APP_INTERCEPTOR } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import Configuration from './config/configuration';
import { NotificationsModule } from './app/notifications/notifications.module';
import { AdministratorModule } from './app/administrator/administrator.module';
import { ContactModule } from './app/contact/contact.module';
import { ApplicationModule } from './app/application/application.module';
import { EmailsConsumer } from './consumers/emails.consumer';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectTimeout: 30000,
        autoLoadEntities: true,
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: configService.get('databasePassword'),
        database: 'ihb',
        subscribers: [OnValidationSubscriber],
        synchronize: !configService.get('production'),
        logging: !configService.get('production'),
        extra: {
          connectionLimit: 50
        }
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('mailerOptions'),
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter()
        }
      })
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [Configuration],
      isGlobal: true
    }),
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      useFactory: ((config: ConfigService) => ({
        name: 'emails',
        redis: config.get('redisOptions')
      }))
    }),
    DoctorModule,
    UsersModule,
    NotificationsModule,
    AdministratorModule,
    ContactModule,
    ApplicationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    isUnique,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    EmailsConsumer
  ]
})
export class AppModule implements OnModuleInit  {
  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    useContainer(this.moduleRef, { fallbackOnErrors: true });
  }
}

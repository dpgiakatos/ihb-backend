import { Module, ClassSerializerInterceptor, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { isUnique } from './helpers/unique.decorator';
import { OnValidationSubscriber } from './helpers/validation.typeorm-subscriber';
import { MailerModule } from '@nestjs-modules/mailer';
import { DoctorModule } from './doctor/doctor.module';
import { ModuleRef, APP_INTERCEPTOR } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import Configuration from './config/configuration';
import { NotificationsModule } from './notifications/notifications.module';
import { AdministratorModule } from './administrator/administrator.module';
import { ContactModule } from './contact/contact.module';
import { ApplicationModule } from './application/application.module';

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
        synchronize: true,
        logging: true,
        extra: {
          connectionLimit: 50
        }
      }),
    }),
    MailerModule.forRoot({
      transport: { jsonTransport: true },
      preview: true,
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter()
      }
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [Configuration],
      isGlobal: true
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
    }
  ]
})
export class AppModule implements OnModuleInit  {
  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    useContainer(this.moduleRef, { fallbackOnErrors: true });
  }
}

import { Module, ClassSerializerInterceptor, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PersonalModule } from './personal/personal.module';
import { isUnique } from './helpers/unique.decorator';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import Configuration from './config/configuration';
import { OnValidationSubscriber } from './helpers/validation.typeorm-subscriber';
import { useContainer } from 'class-validator';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'secure',
      database: 'ihb',
      subscribers: [OnValidationSubscriber],
      synchronize: true,
      logging: true
    }),
    UsersModule,
    PersonalModule,
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
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    isUnique,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
  exports: [
    UsersModule
  ]
})
export class AppModule implements OnModuleInit  {
  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    useContainer(this.moduleRef, { fallbackOnErrors: true });
  }
}

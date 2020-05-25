import { Module, ClassSerializerInterceptor, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { isUnique } from './helpers/unique.decorator';
import { Hospital } from './hospital/hospital.entity';
import { HospitalModule } from './hospital/hospital.module';

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
    AllergicModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    HospitalModule
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

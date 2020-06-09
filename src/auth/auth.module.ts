import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../app/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';
import { Token } from './models/token.entity';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('signingSecret'),
        signOptions: { expiresIn: '1d' }
      }),
    }),
    BullModule.registerQueue({
      name: 'emails'
    }),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Token])
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}

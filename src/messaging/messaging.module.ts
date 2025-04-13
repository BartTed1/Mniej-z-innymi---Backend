import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './controller/token.controller';
import { TokenService } from './service/token.service';
import { Token } from '../entity/token.entity';
import { FcmService } from './service/fcm.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  controllers: [TokenController],
  providers: [TokenService, FcmService],
  exports: [FcmService, TokenService],
})

export class MessagingModule {}

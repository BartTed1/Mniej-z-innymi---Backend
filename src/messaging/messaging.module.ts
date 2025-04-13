import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './controller/token.controller';
import { TokenService } from './service/token.service';
import { Token } from '../entity/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  controllers: [TokenController],
  providers: [TokenService],
})

export class MessagingModule {}

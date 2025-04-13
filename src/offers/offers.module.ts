import { Module } from '@nestjs/common';
import { OfferController } from './controller/offer.controller';
import { OfferService } from './service/offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from 'src/entity/offer.entity';
import { Token } from 'src/entity/token.entity';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Token]),
    MessagingModule
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OffersModule {}

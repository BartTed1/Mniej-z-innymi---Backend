import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Offer } from "src/entity/offer.entity";
import { CreateOfferDto } from "../dto/request/create-offer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOperator, FindOptionsWhere, Like, Repository, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { FcmService } from "src/messaging/service/fcm.service";
import { TokenService } from "src/messaging/service/token.service";
import { Token } from "src/entity/token.entity";

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private fcmService: FcmService,
    private tokenService: TokenService,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = Object.assign(new Offer(), createOfferDto);
    const savedOffer = await this.offerRepository.save(offer);
    
    await this.notifyMatchingOffers(savedOffer);
    
    return savedOffer;
  }

  private async notifyMatchingOffers(newOffer: Offer): Promise<void> {
    // Get cities from station names
    const startCity = newOffer.startStation.split(' ')[0];
    const endCity = newOffer.endStation.split(' ')[0];

    // Get date range for +/- 24 hours
    const date = new Date(newOffer.departureDate);
    const oneDayBefore = new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const oneDayAfter = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString();

    // Find potential matches with broad criteria
    const potentialMatches = await this.offerRepository.find({
      where: [
        {
          startStation: Like(`${startCity}%`),
          endStation: Like(`${endCity}%`),
          departureDate: Between(oneDayBefore, oneDayAfter),
        }
      ],
    });

    // Filter matches based on each offer's criteria
    const matches = potentialMatches.filter(offer => {
      if (offer.deviceId === newOffer.deviceId) return false; // Skip own offer

      // Check if new offer matches the existing offer's criteria
      const offerDate = new Date(offer.departureDate);
      const offerBefore = offer.before ? new Date(offer.before) : null;
      const offerAfter = offer.after ? new Date(offer.after) : null;
      
      // Check date range if specified
      if (offerBefore && offerAfter) {
        if (date < new Date(offerBefore) || date > new Date(offerAfter)) {
          return false;
        }
      }

      // Check station match based on offersByCity
      if (!offer.offersByCity) {
        // Exact station match required
        if (offer.startStation !== newOffer.startStation || 
            offer.endStation !== newOffer.endStation) {
          return false;
        }
      }

      return true;
    });

    if (matches.length === 0) return;

    // Get unique device IDs from matches
    const deviceIds = [...new Set(matches.map(match => match.deviceId))];

    // Get FCM tokens for matched devices
    const tokens = await this.tokenRepository.find({
      where: deviceIds.map(deviceId => ({ deviceId }))
    });

    if (tokens.length === 0) return;

    // Send notifications
    const notificationTitle = 'Znaleziono nową podobną ofertę!';
    const notificationBody = `Nowa oferta na trasie ${newOffer.startStation} - ${newOffer.endStation} w dniu ${newOffer.departureDate}`;

    await this.fcmService.sendNotification(
      tokens.map(t => t.token),
      notificationTitle,
      notificationBody,
      newOffer.id
    );
  }

  async getOfferById(id: string): Promise<Offer | null> {
    return await this.offerRepository.findOne({ where: { id } });
  }

  async getSimilarOffers(
    offerId: string, 
    page: number = 1, 
    limit: number = 10,
  ): Promise<Offer[]> {
    const offer = await this.getOfferById(offerId);
    if (!offer) {
      return [];
    }

    const where = {
      startStation: offer.startStation,
      endStation: offer.endStation,
      departureDate: new Date(offer.departureDate),
    } as {
      startStation: string | FindOperator<string>;
      endStation: string | FindOperator<string>;
      departureDate: Date | FindOperator<Date>;
    };

    if (offer.offersByCity) {
      where.startStation = Like(`${offer.startStation.split(" ")[0]}%`);
      where.endStation = Like(`${offer.endStation.split(" ")[0]}%`);
    }

    if (offer.before || offer.after) {
      where.departureDate = Between(
        new Date(offer.before) || new Date(offer.departureDate),
        new Date(offer.after) || new Date(offer.departureDate),
      );
    }

    return await this.offerRepository.find({
      where: where as unknown as FindOptionsWhere<Offer>,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async deleteOffer(id: string, deviceId: string): Promise<void> {
    const offer = await this.getOfferById(id);
    if (!offer) {
      throw new NotFoundException("Offer not found");
    }

    if (offer.deviceId !== deviceId) {
      throw new UnauthorizedException("Unauthorized");
    }

    await this.offerRepository.delete(id);
  }
}

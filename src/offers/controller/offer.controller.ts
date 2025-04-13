import { Body, Controller, Delete, Get, Headers, InternalServerErrorException, NotFoundException, Param, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateOfferDto } from "../dto/request/create-offer.dto";
import { OfferService } from "../service/offer.service";
import { Offer } from "src/entity/offer.entity";

@ApiTags('Offers')
@Controller('offers')
export class OfferController {
  constructor(
    private readonly offerService: OfferService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiResponse({ status: 201, description: 'Offer created successfully', type: Offer })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createOffer(
    @Body() createOfferDto: CreateOfferDto
  ) {
    try {
      return await this.offerService.createOffer(createOfferDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create offer");
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by ID' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  @ApiResponse({ status: 200, description: 'Offer found', type: Offer })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async getOffer(@Param('id') id: string) {
    const offer = await this.offerService.getOfferById(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get similar offers' })
  @ApiParam({ name: 'id', description: 'Reference offer ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Similar offers found', type: [Offer] })
  async getSimilarOffers(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.offerService.getSimilarOffers(id, page, limit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an offer' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  @ApiResponse({ status: 204, description: 'Offer deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async deleteOffer(
    @Param('id') id: string,
    @Headers('device-id') deviceId: string,
  ) {
    try {
      await this.offerService.deleteOffer(id, deviceId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException("Failed to delete offer");
    }
  }
}

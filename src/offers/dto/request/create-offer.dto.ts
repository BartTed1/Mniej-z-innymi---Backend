import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  startStation: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  endStation: string;
  
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  departureDate: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  before: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  after: string;
  
  @IsBoolean()
  @ApiProperty()
  offersByCity: boolean;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contactMethod: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  deviceId: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
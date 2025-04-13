import { BadRequestException, Body, Controller, Delete, InternalServerErrorException, Param, Put } from "@nestjs/common";
import { TokenService } from "../service/token.service";
import { UpdateTokenRequestDto } from "../dto/request/update-token.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Messaging / Token")
@Controller("messaging/token")
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
  ) {}

  @Put(":deviceId")
  @ApiOperation({ summary: "Update or create token" })
  async updateToken(
    @Param("deviceId") deviceId: string, 
    @Body() body: UpdateTokenRequestDto
  ) {
    try {
      const token = body.token;
      if (!token) {
        throw new BadRequestException("Token is required");
      }
      return await this.tokenService.updateToken(deviceId, token);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to update token");
    }
  }
  
  @Delete(":deviceId")
  @ApiOperation({ summary: "Delete token" })
  async deleteToken(
    @Param("deviceId") deviceId: string
  ) {
    try {
      return await this.tokenService.deleteToken(deviceId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to delete token");
    }
  }
}
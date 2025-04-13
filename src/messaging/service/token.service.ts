import { Injectable } from "@nestjs/common";
import { Token } from "src/entity/token.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async updateToken(deviceId: string, token: string) {
    const existingToken = await this.tokenRepository.findOne({ where: { deviceId } });
    if (existingToken) {
      existingToken.token = token;
      return this.tokenRepository.save(existingToken);
    } else {
      const newToken = this.tokenRepository.create({ deviceId, token });
      return this.tokenRepository.save(newToken);
    }
  }

  async deleteToken(deviceId: string) {
    const token = await this.tokenRepository.findOne({ where: { deviceId } });
    if (token) {
      return this.tokenRepository.remove(token);
    } else {
      throw new Error("Token not found");
    }
  }
}

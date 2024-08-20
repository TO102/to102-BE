import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AddressInfo, LocationResponseDto } from './dto/location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private configService: ConfigService,
  ) {}

  async getLocationById(id: number): Promise<LocationResponseDto> {
    const location = await this.locationRepository.findOne({
      where: { locationId: id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return {
      id: location.locationId,
      province: location.province,
      city: location.city,
      district: location.district,
    };
  }

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<AddressInfo> {
    const apiKey = this.configService.get<string>('KAKAO_CLIENT_ID');
    if (!apiKey) {
      throw new InternalServerErrorException('Kakao API key is not valid');
    }

    try {
      const response = await axios.get(
        'https://dapi.kakao.com/v2/local/geo/coord2address.json',
        {
          params: { x: longitude, y: latitude },
          headers: { Authorization: `KakaoAK ${apiKey}` },
        },
      );

      const addressInfo = response.data.documents[0]?.address;
      if (!addressInfo) {
        throw new NotFoundException(
          'No address found for the given coordinates',
        );
      }

      return {
        province: addressInfo.region_1depth_name,
        city: addressInfo.region_2depth_name,
        district: addressInfo.region_3depth_name,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch address information',
      );
    }
  }
}

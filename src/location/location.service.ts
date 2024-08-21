import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  AddressInfo,
  LocationResponseDto,
  ProvinceCitiesResponseDto,
  ProvinceResponseDto,
} from './dto/location.dto';
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

  private isValidCoordinate(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  }

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<AddressInfo> {
    if (!this.isValidCoordinate(latitude, longitude)) {
      throw new BadRequestException('올바르지 않은 좌표 정보입니다.');
    }

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
  async getCitiesByProvince(
    province: string,
  ): Promise<ProvinceCitiesResponseDto> {
    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .select('DISTINCT location.city', 'city')
      .where('location.province = :province', { province })
      .orderBy('location.city', 'ASC')
      .getRawMany();

    if (!locations || locations.length === 0) {
      throw new NotFoundException(
        `No cities found for the province: ${province}`,
      );
    }

    const cities = locations.map((location) => location.city);

    return {
      province,
      cities,
    };
  }

  async getProvinces(): Promise<ProvinceResponseDto> {
    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .select('DISTINCT location.province', 'province')
      .orderBy('location.province', 'ASC')
      .getRawMany();

    const provinces = locations.map((location) => location.province);

    return {
      provinces: provinces,
    };
  }
}

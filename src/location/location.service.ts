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
import { User } from 'src/entities/user.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getLocationById(id: number): Promise<LocationResponseDto> {
    const location = await this.locationRepository.findOne({
      where: { locationId: id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return {
      locationId: location.locationId,
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
          '주어진 좌표에 위치하는 해당 주소가 없습니다.',
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

  async updateUserLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<LocationResponseDto> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['location'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const addressInfo = await this.getAddressFromCoordinates(
      latitude,
      longitude,
    );

    let location: Location;
    if (user.location) {
      location = user.location;
      location.province = addressInfo.province;
      location.city = addressInfo.city;
      location.district = addressInfo.district;
    } else {
      location = this.locationRepository.create({
        province: addressInfo.province,
        city: addressInfo.city,
        district: addressInfo.district,
        user: user,
      });
    }

    const savedLocation = await this.locationRepository.save(location);

    user.location = savedLocation;
    await this.userRepository.save(user);

    return {
      locationId: savedLocation.locationId,
      province: savedLocation.province,
      city: savedLocation.city,
      district: savedLocation.district,
    };
  }
}

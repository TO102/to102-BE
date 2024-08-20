import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AddressInfo } from './location.types';

@Injectable()
export class LocationService {
  constructor(private configService: ConfigService) {}

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<AddressInfo> {
    const apiKey = this.configService.get<string>('KAKAO_CLIENT_ID');
    if (!apiKey) {
      throw new HttpException(
        'kako API key가 유효하지 못합니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      const response = await axios.get(
        'https://dapi.kakao.com/v2/local/geo/coord2address.json',
        {
          params: {
            x: longitude,
            y: latitude,
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        },
      );

      if (response.data.documents.length === 0) {
        throw new HttpException(
          '해당 좌표에 해당하는 주소는 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      const addressInfo = response.data.documents[0].address;

      if (!addressInfo) {
        throw new HttpException(
          '주소 정보가 불완전합니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        region_1depth_name: addressInfo.region_1depth_name,
        region_2depth_name: addressInfo.region_2depth_name,
        region_3depth_name: addressInfo.region_3depth_name,
      };
    } catch (error) {
      throw new HttpException(
        '주소를 가져오는데 실패하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

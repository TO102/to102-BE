import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { Location } from '../entities/location.entity';
import axios from 'axios';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

jest.mock('axios');

describe('LocationService', () => {
  let service: LocationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  const mockRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAddressFromCoordinates', () => {
    it('should return address info for valid coordinates', async () => {
      const mockResponse = {
        data: {
          documents: [
            {
              address: {
                region_1depth_name: '서울',
                region_2depth_name: '강남구',
                region_3depth_name: '역삼동',
              },
            },
          ],
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);
      mockConfigService.get.mockReturnValue('fake-api-key');

      const result = await service.getAddressFromCoordinates(37.5665, 126.978);

      expect(result).toEqual({
        province: '서울',
        city: '강남구',
        district: '역삼동',
      });
    });

    it('should throw NotFoundException when no address is found', async () => {
      const mockResponse = {
        data: {
          documents: [],
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);
      mockConfigService.get.mockReturnValue('fake-api-key');

      await expect(service.getAddressFromCoordinates(0, 0)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when API key is missing', async () => {
      mockConfigService.get.mockReturnValue(null);

      await expect(
        service.getAddressFromCoordinates(37.5665, 126.978),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});

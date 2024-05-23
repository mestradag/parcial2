import { Test, TestingModule } from '@nestjs/testing';
import { RedsocialService } from './redsocial.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedsocialEntity } from './redsocial.entity';
import { BadRequestException } from '@nestjs/common';

describe('RedsocialService', () => {
  let service: RedsocialService;
  let redsocialRepository: Repository<RedsocialEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedsocialService,
        {
          provide: getRepositoryToken(RedsocialEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RedsocialService>(RedsocialService);
    redsocialRepository = module.get<Repository<RedsocialEntity>>(getRepositoryToken(RedsocialEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLibreria', () => {
    it('should create a red social successfully', async () => {
      const mockRedsocial: Partial<RedsocialEntity> = {
        id: 1,
        nombre: 'Test Redsocial',
        slogan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      };
      jest.spyOn(redsocialRepository, 'create').mockReturnValueOnce(mockRedsocial as RedsocialEntity);
      jest.spyOn(redsocialRepository, 'save').mockResolvedValueOnce(mockRedsocial as RedsocialEntity);

      const createdRedsocial = await service.createLibreria('Test Redsocial', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

      expect(createdRedsocial).toEqual(mockRedsocial);
    });

    it('should throw an error when creating red social with slogan less than 20 characters', async () => {
      await expect(service.createLibreria('Test Redsocial', 'Short slogan')).rejects.toThrow(BadRequestException);
    });
  });
});

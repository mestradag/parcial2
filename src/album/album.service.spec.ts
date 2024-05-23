import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FotoEntity } from 'src/foto/foto.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let fotoRepository: Repository<FotoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumService,
        {
          provide: getRepositoryToken(AlbumEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    fotoRepository = module.get<Repository<FotoEntity>>(getRepositoryToken(FotoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAlbum', () => {
    it('should create an album successfully', async () => {
      const mockAlbum: Partial<AlbumEntity> = {
        id: 1,
        titulo: 'Test Album',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2024-12-31'),
      };
      jest.spyOn(albumRepository, 'create').mockReturnValueOnce(mockAlbum as AlbumEntity);
      jest.spyOn(albumRepository, 'save').mockResolvedValueOnce(mockAlbum as AlbumEntity);

      const createdAlbum = await service.createAlbum('Test Album', new Date('2024-01-01'), new Date('2024-12-31'));

      expect(createdAlbum).toEqual(mockAlbum);
    });

    it('should throw an error when creating album with empty title', async () => {
      await expect(service.createAlbum('', new Date('2024-01-01'), new Date('2024-12-31'))).rejects.toThrow();
    });
  });

  describe('addPhotoToAlbum', () => {
    it('should add photo to album successfully', async () => {
      const mockAlbum: Partial<AlbumEntity> = {
        id: 1,
        titulo: 'Test Album',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2024-12-31'),
        fotos: []
      };
      const mockFoto: Partial<FotoEntity> = {
        id: 1,
        fecha: new Date('2024-06-15').toISOString(),
      };

      jest.spyOn(service, 'findAlbumById').mockResolvedValueOnce(mockAlbum as AlbumEntity);
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(mockFoto as FotoEntity);
      jest.spyOn(albumRepository, 'save').mockResolvedValueOnce(mockAlbum as AlbumEntity);

      await expect(service.addPhotoToAlbum(1, 1, '2024-06-15', '2024-06-15')).resolves.not.toThrow();
    });

    it('should throw an error when photo date is not within album dates', async () => {
      const mockAlbum: Partial<AlbumEntity> = {
        id: 1,
        titulo: 'Test Album',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2024-12-31'),
        fotos: []
      };
      const mockFoto: Partial<FotoEntity> = {
        id: 1,
        fecha: new Date('2023-06-15').toISOString(), // Photo date is before album start date
      };

      jest.spyOn(service, 'findAlbumById').mockResolvedValueOnce(mockAlbum as AlbumEntity);
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(mockFoto as FotoEntity);

      await expect(service.addPhotoToAlbum(1, 1, '2023-06-15', '2023-06-15')).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when photo is not found', async () => {
      jest.spyOn(service, 'findAlbumById').mockResolvedValueOnce({} as AlbumEntity);
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.addPhotoToAlbum(1, 1, '2024-06-15', '2024-06-15')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAlbum', () => {
    it('should delete album successfully', async () => {
      const mockAlbum: Partial<AlbumEntity> = {
        id: 1,
        titulo: 'Test Album',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2024-12-31'),
        fotos: []
      };

      jest.spyOn(service, 'findAlbumById').mockResolvedValueOnce(mockAlbum as AlbumEntity);
      jest.spyOn(albumRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      await expect(service.deleteAlbum(1)).resolves.not.toThrow();
    });

    it('should throw an error when album has assigned photos', async () => {
      const mockAlbum: Partial<AlbumEntity> = {
        id: 1,
        titulo: 'Test Album',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2024-12-31'),
        fotos: [{
          id: 1,
          iso: 0,
          velObturacion: 0,
          apertura: 0,
          fecha: '',
          album: new AlbumEntity,
          usuario: new UsuarioEntity
        }] // Album has assigned photos
      };

      jest.spyOn(service, 'findAlbumById').mockResolvedValueOnce(mockAlbum as AlbumEntity);

      await expect(service.deleteAlbum(1)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when album is not found', async () => {
      jest.spyOn(service, 'findAlbumById').mockResolvedValueOnce(undefined);

      await expect(service.deleteAlbum(999)).rejects.toThrow(NotFoundException);
    });
  });
});

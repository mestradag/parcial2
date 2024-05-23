import { Test, TestingModule } from '@nestjs/testing';
import { FotoService } from './foto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { FotoEntity } from './foto.entity';
import { AlbumEntity } from '../album/album.entity';
import { UsuarioEntity } from '../usuario/usuario.entity'; // Asegúrate de importar UsuarioEntity desde la ubicación correcta
import { NotFoundException } from '@nestjs/common';

describe('FotoService', () => {
  let service: FotoService;
  let fotoRepository: Repository<FotoEntity>;
  let albumRepository: Repository<AlbumEntity>; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FotoService,
        {
          provide: getRepositoryToken(FotoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FotoService>(FotoService);
    fotoRepository = module.get<Repository<FotoEntity>>(getRepositoryToken(FotoEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFoto', () => {
    it('should create a foto successfully', async () => {
      const mockFoto: Partial<FotoEntity> = {
        id: 1,
        iso: 200,
        velObturacion: 50,
        apertura: 10,
        fecha: '',
        album: { id: 1 } as AlbumEntity,
        usuario: { id: 1 } as UsuarioEntity,
      };
      jest.spyOn(fotoRepository, 'create').mockReturnValueOnce(mockFoto as FotoEntity);
      jest.spyOn(fotoRepository, 'save').mockResolvedValueOnce(mockFoto as FotoEntity);

      const createdFoto = await service.createFoto(200, 50, 10);

      expect(createdFoto).toEqual(mockFoto);
    });

    it('should throw an error when creating foto with invalid parameters', async () => {
      await expect(service.createFoto(50, 500, 40)).rejects.toThrow();
    });
  });

  describe('findAllFotos', () => {
    it('should return all fotos', async () => {
      const mockFotos: Partial<FotoEntity>[] = [
        { id: 1, iso: 200, velObturacion: 50, apertura: 10 },
        { id: 2, iso: 400, velObturacion: 100, apertura: 16 },
      ];
      jest.spyOn(fotoRepository, 'find').mockResolvedValueOnce(mockFotos as FotoEntity[]);

      const fotos = await service.findAllFotos();

      expect(fotos).toEqual(mockFotos);
    });
  });

  describe('findFotoByID', () => {
    it('should find foto by ID', async () => {
      const mockFoto: Partial<FotoEntity> = { id: 1, iso: 200, velObturacion: 50, apertura: 10 };
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(mockFoto as FotoEntity);

      const foto = await service.findFotoByID(1);

      expect(foto).toEqual(mockFoto);
    });

    it('should throw an error when foto is not found', async () => {
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findFotoByID(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteFoto', () => {
    it('should delete a foto successfully', async () => {
      const mockFoto: Partial<FotoEntity> = { id: 1, iso: 200, velObturacion: 50, apertura: 10 };
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(mockFoto as FotoEntity);
      jest.spyOn(albumRepository, 'findOne').mockResolvedValueOnce({ id: 1, fotos: [{ id: 1 }] } as AlbumEntity);
      jest.spyOn(fotoRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      await expect(service.deleteFoto(1)).resolves.not.toThrow();
    });

    it('should throw an error when trying to delete non-existing foto', async () => {
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.deleteFoto(999)).rejects.toThrow(NotFoundException);
    });

    it('should delete album if it has only one foto and the foto is deleted', async () => {
      const mockFoto: Partial<FotoEntity> = { id: 1, iso: 200, velObturacion: 50, apertura: 10 };
      jest.spyOn(fotoRepository, 'findOne').mockResolvedValueOnce(mockFoto as FotoEntity);
      jest.spyOn(albumRepository, 'findOne').mockResolvedValueOnce({ id: 1, fotos: [{ id: 1 }] } as AlbumEntity);
      jest.spyOn(fotoRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);
      jest.spyOn(albumRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      await service.deleteFoto(1);

      expect(albumRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUsuario', () => {
    it('should create a user successfully', async () => {
      const mockUsuario: Partial<UsuarioEntity> = {
        id: 1,
        nombre: 'Test User',
        telefono: '1234567890',
      };
      jest.spyOn(usuarioRepository, 'create').mockReturnValueOnce(mockUsuario as UsuarioEntity);
      jest.spyOn(usuarioRepository, 'save').mockResolvedValueOnce(mockUsuario as UsuarioEntity);

      const createdUsuario = await service.createUsuario('Test User', '1234567890');

      expect(createdUsuario).toEqual(mockUsuario);
    });

    it('should throw an error when creating user with invalid phone number', async () => {
      await expect(service.createUsuario('Test User', '1234')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findUsuarioById', () => {
    it('should find a user by ID', async () => {
      const mockUsuario: Partial<UsuarioEntity> = {
        id: 1,
        nombre: 'Test User',
        telefono: '1234567890',
      };
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce(mockUsuario as UsuarioEntity);

      const foundUsuario = await service.findUsuarioById(1);

      expect(foundUsuario).toEqual(mockUsuario);
    });

    it('should throw a NotFoundException when user with given ID is not found', async () => {
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findUsuarioById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllUsuarios', () => {
    it('should find all users', async () => {
      const mockUsuarios: Partial<UsuarioEntity>[] = [
        {
          id: 1,
          nombre: 'Test User 1',
          telefono: '1234567890',
        },
        {
          id: 2,
          nombre: 'Test User 2',
          telefono: '0987654321',
        },
      ];
      jest.spyOn(usuarioRepository, 'find').mockResolvedValueOnce(mockUsuarios as UsuarioEntity[]);

      const foundUsuarios = await service.findAllUsuarios();

      expect(foundUsuarios).toEqual(mockUsuarios);
    });
  });
});

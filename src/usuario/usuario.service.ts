import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    ){}

    async createUsuario(nombre: string, telefono: string): Promise<UsuarioEntity> {
        if (!telefono || telefono.length !== 10) {
            throw new BadRequestException('Phone number must be 10 characters long');
        }

        const usuario = this.usuarioRepository.create({nombre, telefono});
        return this.usuarioRepository.save(usuario);
    }

    async findUsuarioById(id: number): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOne({where:{id}});
        if (!usuario) {
            throw new NotFoundException('User not found');
        }
        return usuario;
    }

    async findAllUsuarios(): Promise<UsuarioEntity[]> {
        return this.usuarioRepository.find();
    }
}

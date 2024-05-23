import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { RedsocialEntity } from './redsocial.entity';

@Injectable()
export class RedsocialService {

    constructor(
        @InjectRepository(RedsocialEntity)
        private readonly libreriaRepository: Repository<RedsocialEntity>,
    ){}

    async createLibreria(nombre: string, slogan: string): Promise<RedsocialEntity> {
        if (!slogan || slogan.length < 20) {
            throw new BadRequestException('El eslogan debe tener al menos 20 caracteres');
        }

        const libreria = this.libreriaRepository.create({ nombre, slogan });
        return this.libreriaRepository.save(libreria);
    }
}

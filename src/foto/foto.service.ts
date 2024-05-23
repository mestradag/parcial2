import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { FotoEntity } from './foto.entity';
import { AlbumEntity } from '../album/album.entity';

@Injectable()
export class FotoService {

    constructor(
        @InjectRepository(FotoEntity)
        private readonly fotoRepository: Repository<FotoEntity>,
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
    ){}

    async createFoto(iso: number, velObturacion: number, apertura: number): Promise<FotoEntity> {
        // Validación de valores ISO, valor de obturación y apertura
        if (iso < 100 || iso > 6400) {
            throw new BadRequestException('El valor ISO debe estar entre 100 y 6400');
        }

        if (velObturacion < 2 || velObturacion > 250) {
            throw new BadRequestException('El valor de la obturación debe estar entre 2 y 250');
        }

        if (apertura < 1 || apertura > 32) {
            throw new BadRequestException('El valor de la apertura debe estar entre 1 y 32');
        }

        // Verificación de la condición adicional
        const valoresPorEncimaDelPromedio = [iso, velObturacion, apertura].filter(valor => valor > (100 + 6400) / 2).length;
        if (valoresPorEncimaDelPromedio > 2) {
            throw new BadRequestException('Máximo 2 valores deben estar por encima del promedio');
        }

        const foto = this.fotoRepository.create({iso, velObturacion, apertura});
        return this.fotoRepository.save(foto);
    }

    async findFotoByID(id: number): Promise<FotoEntity> {
        const foto = await this.fotoRepository.findOne({where:{id}});
        if (!foto) {
            throw new NotFoundException('Foto not found');
        }
        return foto;
    }

    async findAllFotos(): Promise<FotoEntity[]> {
        return this.fotoRepository.find();
    }

    async deleteFoto(id: number): Promise<void> {
        const foto = await this.findFotoByID(id);
        const album = await this.albumRepository.findOne({ where: { fotos: {id} } });

        await this.fotoRepository.delete(id);

        if (album && album.fotos.length === 1) {
            await this.albumRepository.delete(album.id);
        }
    }
}

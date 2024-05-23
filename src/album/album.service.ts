import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { AlbumEntity } from './album.entity';
import { FotoEntity } from 'src/foto/foto.entity';


@Injectable()
export class AlbumService {

    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
        @InjectRepository(FotoEntity)
        private readonly fotoRepository: Repository<FotoEntity>,
    ){}

    async createAlbum(titulo: string, fechaInicio: Date, fechaFin:Date): Promise<AlbumEntity> {
        if (!titulo) {
            throw new BadRequestException('Title cannot be empty');
        }

        const album = this.albumRepository.create({ titulo });
        return this.albumRepository.save(album);
    }

    async findAlbumById(id: number): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where:{id}});
        if (!album) {
            throw new NotFoundException('Album not found');
        }
        return album;
    }

    async addPhotoToAlbum(fotoId: number, albumId: number, fechaInicio: string, fechaFin: string): Promise<void> {
        const album = await this.findAlbumById(albumId);
        const foto = await this.fotoRepository.findOne({where:{id: fotoId}});

        if (!foto) {
            throw new NotFoundException('Foto not found');
        }

        const fechaFoto = new Date(fechaInicio);
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);

        if (fechaFoto < fechaInicioObj || fechaFoto > fechaFinObj) {
            throw new BadRequestException('Foto date is not within the album dates');
        }

        album.fotos = album.fotos || [];
        album.fotos.push(foto);

        await this.albumRepository.save(album);
    }
    

    async deleteAlbum(id: number): Promise<void> {
        const album = await this.findAlbumById(id);

        if (album.fotos && album.fotos.length > 0) {
            throw new BadRequestException('Cannot delete album with assigned photos');
        }

        await this.albumRepository.delete(id);
    }
}

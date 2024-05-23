import { Controller, Get, Post, Delete, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async createAlbum(@Body() body: { titulo: string, fechaInicio: Date, fechaFin: Date }): Promise<AlbumEntity> {
    const { titulo, fechaInicio, fechaFin } = body;
    return this.albumService.createAlbum(titulo, fechaInicio, fechaFin);
  }

  @Get(':id')
  async findAlbumById(@Param('id') id: number): Promise<AlbumEntity> {
    const album = await this.albumService.findAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Post(':albumId/photos/:photoId')
  async addPhotoToAlbum(
    @Param('albumId') albumId: number,
    @Param('photoId') photoId: number,
    @Body() body: { fechaInicio: string, fechaFin: string }
  ): Promise<void> {
    const { fechaInicio, fechaFin } = body;
    await this.albumService.addPhotoToAlbum(photoId, albumId, fechaInicio, fechaFin);
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: number): Promise<void> {
    await this.albumService.deleteAlbum(id);
  }
}

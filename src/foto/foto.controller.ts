import { Controller, Get, Post, Delete, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { FotoService } from './foto.service';
import { FotoEntity } from './foto.entity';

@Controller('fotos')
export class FotoController {
  constructor(private readonly fotoService: FotoService) {}

  @Post()
  async createFoto(@Body() body: { iso: number, velObturacion: number, apertura: number }): Promise<FotoEntity> {
    const { iso, velObturacion, apertura } = body;
    return this.fotoService.createFoto(iso, velObturacion, apertura);
  }

  @Get(':id')
  async findFotoById(@Param('id') id: number): Promise<FotoEntity> {
    const foto = await this.fotoService.findFotoByID(id);
    if (!foto) {
      throw new NotFoundException('Foto not found');
    }
    return foto;
  }

  @Get()
  async findAllFotos(): Promise<FotoEntity[]> {
    return this.fotoService.findAllFotos();
  }

  @Delete(':id')
  async deleteFoto(@Param('id') id: number): Promise<void> {
    await this.fotoService.deleteFoto(id);
  }
}

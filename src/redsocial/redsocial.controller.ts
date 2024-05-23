import { Controller, Post, Body } from '@nestjs/common';
import { RedsocialService } from './redsocial.service';
import { RedsocialEntity } from './redsocial.entity';

@Controller('redes-sociales')
export class RedsocialController {
  constructor(private readonly redsocialService: RedsocialService) {}

  @Post()
  async createRedsocial(@Body() body: { nombre: string, slogan: string }): Promise<RedsocialEntity> {
    const { nombre, slogan } = body;
    return this.redsocialService.createLibreria(nombre, slogan);
  }
}

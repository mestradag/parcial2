import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async createUsuario(@Body() body: { nombre: string, telefono: string }): Promise<UsuarioEntity> {
    const { nombre, telefono } = body;
    return this.usuarioService.createUsuario(nombre, telefono);
  }

  @Get(':id')
  async findUsuarioById(@Param('id') id: number): Promise<UsuarioEntity> {
    return this.usuarioService.findUsuarioById(id);
  }

  @Get()
  async findAllUsuarios(): Promise<UsuarioEntity[]> {
    return this.usuarioService.findAllUsuarios();
  }
}

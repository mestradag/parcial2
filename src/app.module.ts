import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FotoModule } from './foto/foto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RedsocialModule } from './redsocial/redsocial.module';
import { AlbumModule } from './album/album.module';
import { FotoEntity } from './foto/foto.entity';
import { UsuarioEntity } from './usuario/usuario.entity';
import { RedsocialEntity } from './redsocial/redsocial.entity';
import { AlbumEntity } from './album/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import the TypeOrmModule

@Module({
  imports: [FotoModule, UsuarioModule, RedsocialModule, AlbumModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [FotoEntity, UsuarioEntity, RedsocialEntity, AlbumEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

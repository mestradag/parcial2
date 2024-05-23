/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
//Importar todos los entities
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { FotoEntity } from 'src/foto/foto.entity';
import { AlbumEntity } from 'src/album/album.entity';
import { RedsocialEntity } from 'src/redsocial/redsocial.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [UsuarioEntity, FotoEntity, AlbumEntity, RedsocialEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([UsuarioEntity, FotoEntity, AlbumEntity, RedsocialEntity]),
];
	/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
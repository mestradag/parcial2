import { AlbumEntity } from 'src/album/album.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Entity, Column, ManyToOne} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FotoEntity {

    //Cree la entidad FotoEntity la cual tiene un ISO (int), una velObturacion (int), una apertura (Int), una fecha (String) y un id (Long-Autogenerado).

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    iso: number;

    @Column()
    velObturacion: number;

    @Column()
    apertura: number;

    @Column()
    fecha: string;

    //Crea la relación que una foto puede tener un album pero un album puede tener de 1 a 5 fotos
    @ManyToOne(type => AlbumEntity, album => album.fotos)
    album: AlbumEntity;

    //Crea la realicón que una foto tiene un usuario pero un usuario tiene muchas fotos
    @ManyToOne(type => UsuarioEntity, usuario => usuario.fotos)
    usuario: UsuarioEntity;

}



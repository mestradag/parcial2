import { FotoEntity } from 'src/foto/foto.entity';
import { RedsocialEntity } from 'src/redsocial/redsocial.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsuarioEntity {
    //Cree la entidad UsuarioEntity la cual tiene un nombre (String), un teléfono (String) y un id (Long).
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    telefono: string;

    //Crea la relación que un usuario tiene muchas fotos pero una foto tiene un usuario
    @OneToMany(type => FotoEntity, foto => foto.usuario)
    fotos: FotoEntity[];

    //Crea la relación que un usuario tiene una red social pero una redsocial tiene varios usuarios
    @ManyToOne(type => RedsocialEntity, redsocial => redsocial.usuarios)
    redsocial: RedsocialEntity;
}

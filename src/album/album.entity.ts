import { FotoEntity } from "src/foto/foto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AlbumEntity {

    //Cree la entidad Álbum la cual tiene una fechaInicio (Date), una fechaFin (Date), un título (String) y un id (Long).

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fechaInicio: Date;

    @Column()
    fechaFin: Date;

    @Column()
    titulo: string;

    //Crea la relación que un albúm puede tener de 1 a 5 fotos pero una foto tiene un solo album
    @OneToMany(type => FotoEntity, foto => foto.album)
    fotos: FotoEntity[];
    
}

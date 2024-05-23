import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RedsocialEntity {
    // Cree la entidad RedSocialEntity la cual tiene un nombre (String), un slogan (String), y un id (Long).
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    slogan: string;

    //Crea la relación que una red social tiene varios usuarios pero un usuario tiene una red social
    @OneToMany(type => UsuarioEntity, usuario => usuario.redsocial)
    usuarios: UsuarioEntity[];

    
}

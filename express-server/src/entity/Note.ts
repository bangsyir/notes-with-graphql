import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Image } from "./Image";
import { User } from "./User";

@Entity()
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: String, nullable: false })
  title!: string;

  @Column({ type: "varchar", nullable: false })
  description!: string;

  @Column({ nullable: true })
  views!: number;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Image, (image) => image.note)
  images!: Image[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt!: Date;
}

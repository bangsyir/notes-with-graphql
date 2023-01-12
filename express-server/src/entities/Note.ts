// import { EntitySchema } from "typeorm";

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

// export const NoteEntity = new EntitySchema({
//   name: "note",
//   columns: {
//     id: {
//       type: Number,
//       primary: true,
//       generated: true,
//     },
//     title: {
//       type: String,
//       nullable: false,
//     },
//     description: {
//       type: String,
//       nullable: false,
//     },
//     createdAt: {
//       name: "created_at",
//       type: "timestamp with time zone",
//       createDate: true,
//     },
//     updatedAt: {
//       name: "updated_at",
//       type: "timestamp with time zone",
//       updateDate: true,
//     },
//     deletedAt: {
//       name: "deleted_at",
//       type: "timestamp with time zone",
//       deleteDate: true,
//     },
//   },
// });
@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: String })
  title!: string;

  @Column()
  description!: string;

  @CreateDateColumn({ default: Date.now() })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}

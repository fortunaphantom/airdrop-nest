import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class AirdropCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false
  })
  code: string;

  @Column({ nullable: false })
  used: boolean;
}

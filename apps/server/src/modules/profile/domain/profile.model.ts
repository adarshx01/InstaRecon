import { ColumnNumeric } from '@server/core/database'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../../../modules/user/domain'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  publicUrl?: string

  @Column({ nullable: true })
  bio?: string

  @Column({ nullable: true })
  avatarUrl?: string

  @Column({ unique: true })
  userId: string

  @ManyToOne(() => User, parent => parent.profiles)
  @JoinColumn({ name: 'userId' })
  user?: User

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}

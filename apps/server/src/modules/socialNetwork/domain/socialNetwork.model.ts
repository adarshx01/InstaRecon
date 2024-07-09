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

import { UserSocialNetwork } from '../../../modules/userSocialNetwork/domain'

@Entity()
export class SocialNetwork {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  name: string

  @Column({})
  url: string

  @OneToMany(() => UserSocialNetwork, child => child.socialNetwork)
  userSocialNetworks?: UserSocialNetwork[]

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}

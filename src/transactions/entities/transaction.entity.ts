import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  total: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  coupon: string;

  @Column({ type: 'decimal', nullable: true })
  discount: number;

  @OneToMany(
    () => TransactionContents,
    (transaction) => transaction.transaction,
  )
  contents: TransactionContents[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity()
export class TransactionContents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(() => Product, (product) => product.id, {
    eager: true,
    cascade: true,
  })
  product: Product;

  @ManyToOne(() => Transaction, (transaction) => transaction.contents, {
    cascade: true,
  })
  transaction: Transaction;
}

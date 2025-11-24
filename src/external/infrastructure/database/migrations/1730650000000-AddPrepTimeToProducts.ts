import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPrepTimeToProducts1730650000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'prepTime',
        type: 'int',
        isNullable: false,
        default: 15,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'prepTime');
  }
}

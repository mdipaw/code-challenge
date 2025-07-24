import { Migration } from '@mikro-orm/migrations';

export class Migration20250724053652 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "resource" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`drop table if exists "resource_entity" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "resource_entity" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`drop table if exists "resource" cascade;`);
  }

}

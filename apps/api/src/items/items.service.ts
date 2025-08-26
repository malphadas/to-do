import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ItemsService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.item.findMany({
      orderBy: [
        { isChecked: 'asc' }, // false (unchecked) → true (checked)
        { createdAt: 'desc' }, // newest first within each group
        { id: 'asc' }, // tie-breaker for determinism
      ],
    });
  }

  findOne(id: string) {
    return this.databaseService.item.findUnique({ where: { id } });
  }

  create(createItemDto: Prisma.ItemCreateInput) {
    return this.databaseService.item.create({ data: createItemDto });
  }

  update(id: string, updateItemDto: Prisma.ItemUpdateInput) {
    return this.databaseService.item.update({
      where: { id },
      data: updateItemDto,
    });
  }

  remove(id: string) {
    return this.databaseService.item.delete({ where: { id } });
  }
}

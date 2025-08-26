import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ItemsModule } from './items/items.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ItemsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

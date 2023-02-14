import { CategorySequelize } from '@fm/micro-videos/category/infra';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_PROVIDERS } from './categories.providers';
import { CategoriesService } from './categories.service';

@Module({
  imports: [SequelizeModule.forFeature([CategorySequelize.CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ...Object.values(CATEGORIES_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORIES_PROVIDERS.USE_CASES)
  ]
})
export class CategoriesModule { }

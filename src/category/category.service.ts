import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.shema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel : Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) : Promise<CategoryDocument> {
    const category = await this.categoryModel.create(createCategoryDto);
    return category;
  }

  async findAllRoot() : Promise<CategoryDocument[]> {
    const data = await this.categoryModel.find({ parent: { $exists: false } });
    return data;
  }

  async findChild(id: string) : Promise<CategoryDocument[]>{
    if(!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct ID!');
    }

    const data = await this.categoryModel.find({parent : id});

    return data;
  }

  async update(
    id: string, 
    updateCategoryDto: UpdateCategoryDto
    ) : Promise<CategoryDocument>{
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct ID!');
    }

    const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto,{
      new: true,
      runValidators: true
    });

    if(!category) {
      throw new NotFoundException('Post not found');
    }

    return category;
  }

  async deleteCategoryAndDescendants(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct ID!');
    }
    try {
      await this.deleteChildCategories(id);
      await this.categoryModel.findByIdAndRemove(id);
      return {
        "message" : "Successfully deleted category!"
      }
    } catch(error) {
      return new Error(error);
    }
  }

  private async deleteChildCategories(categoryId: string): Promise<void> {
    
    const childCategories = await this.categoryModel.find({
      parent: categoryId,
    });

    childCategories.forEach(async (category) => {
      await this.deleteChildCategories(category._id);
    })

    await this.categoryModel.deleteMany({parent: categoryId});
  }
}

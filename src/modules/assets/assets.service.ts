import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { assetsTable } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createAsset(data: CreateAssetDto) {
    const result = await this.db.insert(assetsTable).values(data).returning();
    return result[0];
  }

  async getAllAssets() {
    return this.db.select().from(assetsTable);
  }

  async getAssetById(id: number) {
    const assets = await this.db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.id, id));
    return assets[0];
  }

  async updateAsset(id: number, data: UpdateAssetDto) {
    const result = await this.db
      .update(assetsTable)
      .set(data)
      .where(eq(assetsTable.id, id))
      .returning();
    return result[0];
  }

  async deleteAsset(id: number): Promise<boolean> {
    const result = await this.db
      .delete(assetsTable)
      .where(eq(assetsTable.id, id))
      .returning();
    return result.length > 0;
  }

  async duplicateAssets(originalEntityId: number) {
    // fetch all assets linked to the original entity
    const assetsToDuplicate = await this.db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.entity_id, originalEntityId));

    return assetsToDuplicate;
  }
}

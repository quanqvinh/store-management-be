import { Module } from '@nestjs/common'
import { ProductModule } from '@/modules/product/product.module'
import { FileModule } from '@/modules/file/file.module'
import { CleanerController } from './cleaner.controller'
import { StoreModule } from '../store/store.module'

@Module({
	imports: [ProductModule, FileModule, StoreModule],
	controllers: [CleanerController],
})
export class CleanerModule {}

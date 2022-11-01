import { Module } from '@nestjs/common'
import { ProductModule } from '@/modules/product/product.module'
import { FileModule } from '@/modules/file/file.module'
import { CleanerController } from './cleaner.controller'

@Module({
	imports: [ProductModule, FileModule],
	controllers: [CleanerController],
})
export class CleanerModule {}

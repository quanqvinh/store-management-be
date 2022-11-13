import { Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class DeliveryOrder {}

export const DeliveryOrderSchema = SchemaFactory.createForClass(DeliveryOrder)

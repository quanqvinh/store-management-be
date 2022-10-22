import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { AppliedCoupon } from './applied-coupon.schema'
import { Document } from 'mongoose'

export type AppliedOnceCouponDocument = AppliedOnceCoupon & Document

@Schema({ versionKey: false })
export class AppliedOnceCoupon extends AppliedCoupon {}

export const AppliedOnceCouponSchema = SchemaFactory.createForClass(AppliedOnceCoupon)

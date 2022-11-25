import { OrderStatus } from '@/constants'
import { MemberOrder } from '../../schemas'

export class OrderListByStatusDto {
	status: OrderStatus
	orders: Array<MemberOrder>
}

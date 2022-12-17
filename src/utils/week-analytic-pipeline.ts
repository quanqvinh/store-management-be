import { PipelineStage } from 'mongoose'

/**
 * Needed: createdAt. Result: week: -1 | 0 | 1
 */
export const weekAnalyticPipeline = (
	startTime1 = 7,
	startTime2 = 14
): PipelineStage[] => [
	{
		$addFields: {
			today: {
				$dateFromString: {
					dateString: {
						$dateToString: {
							date: '$$NOW',
							format: '%Y-%m-%d',
						},
					},
					format: '%Y-%m-%d',
				},
			},
		},
	},
	{
		$addFields: {
			oneWeekAgo: {
				$dateSubtract: {
					startDate: '$today',
					unit: 'day',
					amount: startTime1,
				},
			},
			twoWeekAgo: {
				$dateSubtract: {
					startDate: '$today',
					unit: 'day',
					amount: startTime2,
				},
			},
		},
	},
	{
		$addFields: {
			isOneWeekAgo: {
				$sum: [
					{ $cmp: ['$createdAt', '$oneWeekAgo'] },
					{ $cmp: ['$today', '$createdAt'] },
				],
			},
			isTwoWeekAgo: {
				$sum: [
					{ $cmp: ['$createdAt', '$twoWeekAgo'] },
					{ $cmp: ['$oneWeekAgo', '$createdAt'] },
				],
			},
		},
	},
	{
		$addFields: {
			week: {
				$cond: {
					if: { $gt: ['$isOneWeekAgo', 0] },
					then: 0,
					else: {
						$cond: {
							if: { $gt: ['$isTwoWeekAgo', 0] },
							then: 1,
							else: -1,
						},
					},
				},
			},
		},
	},
]

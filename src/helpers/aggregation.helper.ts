export class AggregationHelper {
    static getCountAndDataByFacet(aggregate: any[], page: number, size: number) {
        aggregate.push({
            $facet: {
                total: [{ $count: 'total' }],
                data: [
                    { $sort: { created_at: -1 } },
                    { $skip: (page - 1) * size },
                    { $limit: size },
                ],
            },
        },
            {
                $unwind: '$total',
            },
            {
                $project: {
                    _id: 0,
                    count: '$total.total',
                    data: 1,
                },
            })
    }

    static filterByMatchAndQueriesAll(aggregate: any[], queries: any[]) {
        aggregate.push({
            $match:
            {
                $and: [
                    ...queries
                ]
            }
        }
        )
    }

    static unwindWithPreserveNullAndEmptyArrays(aggregate: any[], path: string) {
        aggregate.push({
            $unwind: { path: `$${path}`, preserveNullAndEmptyArrays: true }
        });
    }

    static lookupForIdForeignKey(aggregate: any[], from: string, localField: string, asName: string) {
        aggregate.push(
            {
                $lookup: {
                    from: from,
                    localField: localField,
                    foreignField: '_id',
                    as: asName
                }
            });
    }

}
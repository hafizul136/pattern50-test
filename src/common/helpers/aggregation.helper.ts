import { ConstructObjectsFromArrays } from "./constructObjectsFromArrays";

export class AggregationHelper {
    static filterByMatchAndQueriesAll(aggregate: any[], queries: any[]): void {
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

    static unsetAField(aggregate: any[], field: string): void {
        aggregate.push({
            $unset: field
        })
    }

    static unwindAField(aggregate: any[], field: string, preserveNullAndEmpty: boolean): void {
        aggregate.push({
            $unwind: {
                path: `$${field}`, preserveNullAndEmptyArrays: preserveNullAndEmpty
            }
        })
    }

    static lookupForIdForeignKey(aggregate: any[], from: string, localField: string, asName: string): void {
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

    static lookupForIdLocalKey(aggregate: any[], from: string, foreignField: string, asName: string): void {
        aggregate.push(
            {
                $lookup: {
                    from: from,
                    localField: '_id',
                    foreignField: foreignField,
                    as: asName
                }
            });
    }

    static lookupForCustomFields(aggregate: any[], from: string, localField: string, foreignField: string, asName: string): void {
        aggregate.push(
            {
                $lookup: {
                    from: from,
                    localField: localField,
                    foreignField: foreignField,
                    as: asName
                }
            });
    }

    static sortBy(aggregate: any[], sortBy: string): void {
        aggregate.push({
            $sort: sortBy
        })
    }

    static unwindWithPreserveNullAndEmptyArrays(aggregate: any[], path: string): void {
        aggregate.push({
            $unwind: { path: `$${path}`, preserveNullAndEmptyArrays: true }
        });
    }

    static getCountAndDataByFacet(aggregate: any[], page: number, size: number): void {
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
                    total: '$total.total',
                    data: 1,
                },
            })
    }

    static projectFields(aggregate: any[], fields: string[]): void {
        const projectFields = ConstructObjectsFromArrays.getFieldsToProjectFromArray(fields);

        aggregate.push({
            $project: {
                ...projectFields
            }
        })
    }

    static modifyTimeToSplit(aggregate: any[]): void {
        aggregate.push({
            "$addFields": {
                startTimeForSplit: {
                    $concat: [
                        { $substr: ["$startTime", 0, 5] },
                        {
                            $cond: {
                                if: { $eq: [{ $substr: ["$startTime", 5, 2] }, "PM"] },
                                then: ":PM",
                                else: ":AM"
                            }
                        }
                    ]
                },
                endTimeForSplit: {
                    $concat: [
                        { $substr: ["$endTime", 0, 5] },
                        {
                            $cond: {
                                if: { $eq: [{ $substr: ["$endTime", 5, 2] }, "PM"] },
                                then: ":PM",
                                else: ":AM"
                            }
                        }
                    ]
                }
            }
        });
    }

    static splitStartAndEndTime(aggregate: any[]): void {
        aggregate.push({
            $addFields: {
                startTimeParts: {
                    $split: ["$startTimeForSplit", ":"]
                },
                endTimeParts: {
                    $split: ["$endTimeForSplit", ":"]
                }
            }
        });
    }

    static getSplittedTimeInInteger(aggregate): void {
        aggregate.push({
            $addFields: {
                startHour: {
                    $toInt: {
                        $arrayElemAt: ["$startTimeParts", 0]
                    }
                },
                endHour: {
                    $toInt: {
                        $arrayElemAt: ["$endTimeParts", 0]
                    }
                },
                startMinute: {
                    $toInt: {
                        $arrayElemAt: ["$startTimeParts", 1]
                    }
                },
                endMinute: {
                    $toInt: {
                        $arrayElemAt: ["$endTimeParts", 1]
                    }
                },
                startAmPm: {
                    $arrayElemAt: ["$startTimeParts", 2]
                },
                endAmPm: {
                    $arrayElemAt: ["$endTimeParts", 2]
                }
            }
        });

    }

    static getTimeIn24HourFormat(aggregate: any[]): void {
        aggregate.push({
            "$addFields": {
                startTimeInHours: {
                    $cond: {
                        if: { $eq: ["$startAmPm", "PM"] },
                        then: {
                            $concat: [
                                {
                                    $toString: {
                                        $add: [
                                            {
                                                $cond: {
                                                    if: { $eq: ["$startHour", 12] },
                                                    then: 0,
                                                    else: "$startHour"
                                                }
                                            },
                                            12
                                        ]
                                    }
                                },
                                ":",
                                {
                                    $toString: {
                                        $cond: {
                                            if: { $lt: ["$startMinute", 10] },
                                            then: {
                                                $concat: ["0", { $toString: "$startMinute" }]
                                            },
                                            else: { $toString: "$startMinute" }
                                        }
                                    }
                                }
                            ]
                        },
                        else: {
                            $concat: [
                                {
                                    $toString: {
                                        $cond: {
                                            if: { $eq: ["$startHour", 12] },
                                            then: "00",
                                            else: {
                                                $cond: {
                                                    if: { $lt: ["$startHour", 10] },
                                                    then: {
                                                        $concat: ["0", { $toString: "$startHour" }]
                                                    },
                                                    else: { $toString: "$startHour" }
                                                }
                                            }
                                        }
                                    }
                                },
                                ":",
                                {
                                    $toString:
                                    {
                                        $cond: {
                                            if: { $lt: ["$startMinute", 10] },
                                            then: {
                                                $concat: ["0", { $toString: "$startMinute" }]
                                            },
                                            else: { $toString: "$startMinute" }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                endTimeInHours: {
                    $cond: {
                        if: { $eq: ["$endAmPm", "PM"] },
                        then: {
                            $concat: [
                                {
                                    $toString: {
                                        $add: [
                                            {
                                                $cond: {
                                                    if: { $eq: ["$endHour", 12] },
                                                    then: 0,
                                                    else: "$endHour"
                                                }
                                            },
                                            12
                                        ]
                                    }
                                },
                                ":",
                                {
                                    $toString: {
                                        $cond: {
                                            if: { $lt: ["$endMinute", 10] },
                                            then: {
                                                $concat: ["0", { $toString: "$endMinute" }]
                                            },
                                            else: { $toString: "$endMinute" }
                                        }
                                    }
                                }
                            ]
                        },
                        else: {
                            $concat: [
                                {
                                    $toString: {
                                        $cond: {
                                            if: { $eq: ["$endHour", 12] },
                                            then: "00",
                                            else: {
                                                $cond: {
                                                    if: { $lt: ["$endHour", 10] },
                                                    then: {
                                                        $concat: ["0", { $toString: "$endHour" }]
                                                    },
                                                    else: { $toString: "$endHour" }
                                                }
                                            }
                                        }
                                    }
                                },
                                ":",
                                {
                                    $toString: {
                                        $cond: {
                                            if: { $lt: ["$endMinute", 10] },
                                            then: {
                                                $concat: ["0", { $toString: "$endMinute" }]
                                            },
                                            else: { $toString: "$endMinute" }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        });
    }
}
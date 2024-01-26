export class UpdateMultipleDataHandler {
    static findDataToUpdate(existingData: any[], newData: any[]) {
        // find the common data by comparing both existing and new data arrays existing charger are object ids and newData are string arrays
        const existingDataSet = new Set(existingData.map(item => item.toString()));

        const commonData = newData.filter(item => existingDataSet.has(item));
        const commonDataSet = new Set(commonData.map(item => item.toString()));

        // find to add ids by subtracting common data from newData
        const idsToAdd = newData.filter(item => !existingDataSet.has(item));

        // find to remove ids by subtracting commonData from existingData
        const idsToRemove = existingData
            .filter(item => !commonDataSet.has(item.toString()))
            .map(item => item.toString());
        return {
            idsToAdd,
            idsToRemove,
            commonData
        }
    }
}
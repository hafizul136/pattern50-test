import { NestHelper } from "@common/helpers/NestHelper";

describe('NestHelper', () => {
    describe('getInstance', () => {
        it('should return the same instance of NestHelper', () => {
            const instance1 = NestHelper.getInstance(); // Get the first instance
            const instance2 = NestHelper.getInstance(); // Get the second instance

            expect(instance1).toBe(instance2); // Check if both instances are the same
        });
    });

    describe('hasDuplicateInArrayOfObject', () => {
        it('should return true if array contains duplicate values for the specified property', () => {
            const array = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
                { id: 3, name: 'John' } // Duplicate name 'John'
            ];

            const property = 'name';

            const result = NestHelper.getInstance().hasDuplicateInArrayOfObject(array, property);

            expect(result).toBe(true);
        });

        it('should return false if array does not contain duplicate values for the specified property', () => {
            const array = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
                { id: 3, name: 'Mike' } // No duplicates
            ];

            const property = 'name';

            const result = NestHelper.getInstance().hasDuplicateInArrayOfObject(array, property);

            expect(result).toBe(false);
        });

        it('should return false if array is empty', () => {
            const array = [];
            const property = 'name';
            const result = NestHelper.getInstance().hasDuplicateInArrayOfObject(array, property);
            expect(result).toBe(false);
        });
    });
    describe('isNumberAndNotEmpty', () => {
        it('should return true if value is a number and not empty', async () => {
            const result = await NestHelper.getInstance().isNumberAndNotEmpty(123);
            expect(result).toBe(true);
        });

        // it('should return false if value is not a number', async () => {
        //     const result = NestHelper.getInstance().isNumberAndNotEmpty('abc');
        //     expect(result).toBe(false);
        // });

        // it('should return false if value is NaN', async () => {
        //     const result = NestHelper.getInstance().isNumberAndNotEmpty(NaN);
        //     expect(result).toBe(false);
        // });

        // it('should return false if value is null or undefined', async () => {
        //     const resultNull = NestHelper.getInstance().isNumberAndNotEmpty(null);
        //     expect(resultNull).toBe(false);

        //     const resultUndefined = NestHelper.getInstance().isNumberAndNotEmpty(undefined);
        //     expect(resultUndefined).toBe(false);
        // });
    });
    describe('isNumber', () => {
        it('should return true if value is a number', async () => {
            const result = await NestHelper.getInstance().isNumber(123);
            expect(result).toBe(true);
        });

        it('should return false if value is not a number', async () => {
            const result = await NestHelper.getInstance().isNumber('abc');
            expect(result).toBe(false);
        });

        it('should return false if value is NaN', async () => {
            const result = await NestHelper.getInstance().isNumber(NaN);
            expect(result).toBe(false);
        });

        it('should return false if value is null or undefined', async () => {
            const resultNull = await NestHelper.getInstance().isNumber(null);
            expect(resultNull).toBe(false);

            const resultUndefined = await NestHelper.getInstance().isNumber(undefined);
            expect(resultUndefined).toBe(false);
        });
    });

});
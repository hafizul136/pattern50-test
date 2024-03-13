export class MongooseHelperMock {
    static getInstance() {
        return new MongooseHelperMock();
    }

    isValidMongooseId(id: string): boolean {
        return true;
    }
}
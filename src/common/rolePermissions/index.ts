import { IPermissionData } from '@modules/roles/interfaces/role.interface';
import * as fs from 'fs';

const filePath = `./src/common/rolePermissions/scopes.json`;
export const mainServiceRolePermissions = (): IPermissionData[] => {
    return readJsonFile(filePath)
}

function readJsonFile(filePath: string): IPermissionData[] {
    try {
        // Read the JSON file synchronously
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse the JSON content into a JavaScript object
        const jsonData: IPermissionData[] = JSON.parse(fileContent);

        return jsonData;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
}

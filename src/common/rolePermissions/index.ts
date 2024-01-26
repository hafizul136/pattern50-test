import * as fs from 'fs';

const filePath = `./src/common/rolePermissions/scopes.json`;
export const mainServiceRoles = () => {
    return readJsonFile(filePath)
}

function readJsonFile(filePath: string): any {
    try {
        // Read the JSON file synchronously
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse the JSON content into a JavaScript object
        const jsonData = JSON.parse(fileContent);

        return jsonData;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
}

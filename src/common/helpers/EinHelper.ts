
import { HttpStatus } from '@nestjs/common';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { appConfig } from '../../configuration/app.config';
import { ExceptionHelper } from './ExceptionHelper';
export class EINSecureHelper {


    static async encrypt(text: string, secretKey: string): Promise<string> {

        const key = (await promisify(scrypt)(secretKey, 'salt', 32)) as Buffer;
        const iv = Buffer.from(secretKey, 'hex');
        const cipher = createCipheriv('aes-256-ctr', key, iv);
        const encryptedText = Buffer.concat([
            cipher.update(text),
            cipher.final(),
        ]);

        return encryptedText.toString('hex')

    }

    static async decrypt(text: string, secretKey: string): Promise<string> {

        const iv = Buffer.from(secretKey, 'hex');
        const key = (await promisify(scrypt)(secretKey, 'salt', 32)) as Buffer;
        const buffer = Buffer.from(text, 'hex');
        const decipher = createDecipheriv('aes-256-ctr', key, iv);
        const decryptedText = Buffer.concat([
            decipher.update(buffer),
            decipher.final(),
        ]);

        return decryptedText?.toString();
    }

    static async getEinHashed(ein: string) {
        try {
            return await EINSecureHelper.encrypt(
                ein,
                appConfig.einHashedSecret
            );
        } catch (error) {
            ExceptionHelper.getInstance().defaultError(
                error?.message,
                error?.code,
                HttpStatus.BAD_REQUEST
            );
        }
    }
    static async decryptTest(encryptedText: string, secretKey: string): Promise<string> {
        try {
            const key = (await promisify(scrypt)(secretKey, 'salt', 32)) as Buffer;
            const iv = Buffer.from(secretKey, 'hex');
            const decipher = createDecipheriv('aes-256-ctr', key, iv);
            const encryptedBuffer = Buffer.from(encryptedText, 'hex');
            const decryptedText = Buffer.concat([
                decipher.update(encryptedBuffer),
                decipher.final(),
            ]);

            return decryptedText.toString();
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message);
        }
    }


}
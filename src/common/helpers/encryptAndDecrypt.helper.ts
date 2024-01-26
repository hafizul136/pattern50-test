import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
    private readonly algorithm: string = 'aldsfkja65d4fa654sdf54a5sd4f56a4sdf54';
    private readonly secretKey: string = '65a4sdf565a6d4sf98afea564f9e87f9a84f5d649e8fa4f37easdfa9e798a4';

    encrypt(text: string): string {
        const cipher = crypto.createCipher(this.algorithm, this.secretKey);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(encryptedText: string): string {
        const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
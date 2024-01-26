import * as crypto from 'crypto';

export class EncryptionHelper {
    private static readonly algorithm: string = 'aes-256-cbc';
    private static readonly ENC = 'bf3c199c2470cb477d907b1e0917c17b';
    private static readonly IV = "5183666c72eec9e4";
    private static readonly secretKey: string = '65a4sdf565a6d4sf98afea564f9e87f9a84f5d649e8fa4f37easdfa9e798a4';

    static encrypt(text: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.ENC, this.IV);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decrypt(encryptedText: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.ENC, this.IV);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
import { S3 } from 'aws-sdk';
import fs from 'fs';
import { FileTypeMatcher, FileTypes } from './file.type.matcher';
import { Utils } from './utils';

export interface IAwsSesSendEmail {
    to: string;
    from: string;
    text: string;
    subject: string;
    sendersName: string;
    attachments?: {
        filename: string;
        content: Buffer;
        contentType: string;
        encoding: string;
    }[];
}

export class AwsServices {
    static S3 = class {
        static async uploadFile(
            file: Express.Multer.File,
            acceptedFileType: FileTypes = FileTypes.ANY
        ): Promise<-1 | S3.ManagedUpload.SendData> {
            if (acceptedFileType != FileTypes.ANY) {
                if (acceptedFileType == FileTypes.IMAGE) {
                    if (!FileTypeMatcher.isImage(file.mimetype)) {
                        return -1;
                    }
                } else if (acceptedFileType == FileTypes.VIDEO) {
                    if (!FileTypeMatcher.isVideo(file.mimetype)) {
                        return -1;
                    }
                } else if (acceptedFileType == FileTypes.DOC) {
                    if (!FileTypeMatcher.isDoc(file.mimetype)) {
                        return -1;
                    }
                }
            }

            const s3: S3 = new S3({
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
            });

            const bufferOg = file?.buffer ?? fs.readFileSync(file.path);

            return await s3
                .upload({
                    Bucket: 'pattern50',
                    Key: String(Utils.getUniqueId()),
                    Body: bufferOg,
                    ContentType: file.mimetype,
                })
                .promise();
        }

        static async deleteFile(key: string): Promise<unknown> {
            const s3: S3 = new S3({
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
            });

            const params = { Bucket: 'chargeonsite', Key: key };
            return new Promise((resolve) => {
                s3.deleteObject(params, (err, data) => {
                    if (err) {
                        resolve(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
    };
}

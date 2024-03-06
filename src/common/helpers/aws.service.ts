import { AWSError, S3, SES } from 'aws-sdk';
import fs from 'fs';
import { appConfig } from '../../configuration/app.config';
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

    static SimpleEmailService = class {
        static async sendEmail(options: IAwsSesSendEmail): Promise<{
            err: AWSError;
            data: SES.SendRawEmailResponse;
        }> {
            const ses = new SES({
                accessKeyId: appConfig.accessKeyId,
                secretAccessKey: appConfig.secretAccessKey,
                region: appConfig.awsRegion,
            });

            // return new Promise((resolve, reject) => {
            return new Promise((resolve) => {
                let ses_mail =
                    // "From: 'AWS Tutorial Series' <"
                    `From: '${options.sendersName}' <` + options.from + '>\n';
                ses_mail = ses_mail + 'To: ' + options.to + '\n';
                ses_mail = ses_mail + `Subject: ${options.subject}\n`;
                ses_mail = ses_mail + 'MIME-Version: 1.0\n';
                ses_mail = ses_mail + 'Content-Type: multipart/mixed; boundary="NextPart"\n\n';
                ses_mail = ses_mail + '--NextPart\n';
                ses_mail = ses_mail + 'Content-Type: text/html; charset=us-ascii\n\n';
                ses_mail = ses_mail + `${options.text}\n\n`;
                ses_mail = ses_mail + '--NextPart\n';
                ses_mail = ses_mail + 'Content-Type: text/plain;\n';
                // ses_mail = ses_mail + "Content-Disposition: attachment; filename=\"attachment.txt\"\n\n";
                // ses_mail = ses_mail + "AWS Tutorial Series - Really cool file attachment!" + "\n\n";


                // Check if there is an attachment
                if (options.attachments && options.attachments.length > 0) {
                    for (const attachment of options.attachments) {
                        ses_mail = ses_mail + '--NextPart\n';
                        ses_mail = ses_mail + `Content-Type: ${attachment.contentType}; name="${attachment.filename}"\n`;
                        ses_mail = ses_mail + 'Content-Disposition: attachment\n';
                        ses_mail = ses_mail + 'Content-Transfer-Encoding: base64\n\n';
                        ses_mail = ses_mail + attachment.content.toString('base64') + '\n\n';
                    }
                }


                ses_mail = ses_mail + '--NextPart--';

                const params = {
                    RawMessage: { Data: Buffer.from(ses_mail) },
                    Destinations: [options.to],
                    Source: `'${options.sendersName}' <` + options.from + ">'",
                };

                ses.sendRawEmail(params, function (err, data) {
                    resolve({
                        err,
                        data,
                    });
                });
            });
        }
    };
}

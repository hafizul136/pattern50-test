export class StripeTransferDto {
    sk?: string;
    connectedAccountId?: string;
    amount?: number;
    paymentIntentId?: string;
    metaData?: any;
}
import * as dotenv from 'dotenv';
dotenv.config();

// Load environment-specific variables based on NODE_ENV
if (process.env.NODE_ENV == 'production') {
    dotenv.config({ path: '.env.production', override: true });
} else {
    dotenv.config();

}

export interface ICommonConfig {
    einHashedSecret: string
}
export interface IConfig extends ICommonConfig {
    port: number;
    mongodbURL: string
    dbName: string
    jwtAccessToken: string
    jwtRefreshToken: string
    jwtAccessTokenExpire: string
    jwtRefreshTokenExpire: string
    serverType: string
    rmqURL: string
    redisURL: string
    stripeSecret: string
    accessKeyId: string
    secretAccessKey: string
    awsRegion: string
}

const commonConfig = (): ICommonConfig => {
    // Common configuration settings
    const einHashedSecret = process.env.EIN_HASHED_SECRET
    if (!einHashedSecret) throw new Error('EIN_HASHED_SECRET must be specified');
    return {
        einHashedSecret
    }
};


const getAppConfig = (): IConfig => {
    const port = parseInt(process.env.APP_PORT);
    const mongodbURL = process.env.MONGODB_URL;
    const dbName = process.env.DB_NAME;
    const jwtAccessToken = process.env.JWT_ACCESS_SECRET;
    const jwtRefreshToken = process.env.JWT_REFRESH_SECRET;
    const jwtAccessTokenExpire = process.env.JWT_ACCESS_SECRET_EXPIRE;
    const jwtRefreshTokenExpire = process.env.JWT_REFRESH_SECRET_EXPIRE;
    const serverType = process.env.SERVER_TYPE;
    const rmqURL = process.env.RMQ_URL;
    const redisURL = (process.env.REDIS_ENDPOINT)?.split('//')[1];
    const stripeSecret = process.env.STRIPE_SECRET;
    const accessKeyId = process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.SECRET_ACCESS_KEY;
    const awsRegion = process.env.AWS_REGION;

    if (!port) throw new Error('port must be specified');
    if (!mongodbURL) throw new Error('mongodbURL must be specified');
    if (!dbName) throw new Error('dbName must be specified');
    if (!jwtAccessToken) throw new Error('jwtAccessToken must be specified');
    if (!jwtAccessTokenExpire) throw new Error('jwtAccessTokenExpire must be specified');
    if (!jwtRefreshTokenExpire) throw new Error('jwtRefreshTokenExpire must be specified');
    if (!jwtRefreshToken) throw new Error('jwtRefreshToken must be specified');
    if (!serverType) throw new Error('serverType must be specified');
    if (!rmqURL) throw new Error('rmqURL must be specified');
    if (!stripeSecret) throw new Error('stripeSecret must be specified');
    if (!accessKeyId) throw new Error('accessKeyId must be specified');
    if (!secretAccessKey) throw new Error('secretAccessKey must be specified');
    if (!awsRegion) throw new Error('awsRegion must be specified');
    return {
        ...commonConfig(),
        port,
        mongodbURL,
        dbName,
        jwtAccessToken,
        jwtRefreshToken,
        jwtAccessTokenExpire,
        jwtRefreshTokenExpire,
        serverType,
        rmqURL,
        redisURL,
        stripeSecret,
        accessKeyId,
        secretAccessKey,
        awsRegion
    };
};
export const appConfig = getAppConfig();

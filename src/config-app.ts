import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

export const ConfigMongoDB = MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory:async (configService:ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USER')}:${configService.get(
            'DB_PASSWORD',
          )}@${configService.get('DB_HOST')}/${configService.get('DB_NAME')}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
    }),
    inject: [ConfigService],
})
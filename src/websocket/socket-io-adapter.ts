import { INestApplicationContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io"


export class SocketIOAdapter extends IoAdapter {
    private readonly logger = new Logger(SocketIOAdapter.name);

    constructor (
        private app: INestApplicationContext,
        private configService: ConfigService,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
      
    
        this.logger.log('Configuring SocketIO server with custom CORS options');
  
    
        const server: Server = super.createIOServer(port, options);
    
        //server.of('posts').use(createTokenMiddleware(jwtService, this.logger));
    
        return server;
    }
}
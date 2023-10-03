import { Logger } from "@nestjs/common";
import { Namespace, Socket } from "socket.io";
import { 
    MessageBody,
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    OnGatewayInit, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer 
} from "@nestjs/websockets";
import * as Redis from 'ioredis';

//const Redis = require("ioredis");


@WebSocketGateway({
    namespace: 'messages',
})
export class MessageGetway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(MessageGetway.name);
    private redisPublisher: any;

    constructor () {}

    @WebSocketServer() io : Namespace;


    afterInit(server: any) {
        this.logger.log('Websocket Gateway initialized!');
        this.redisPublisher = new Redis.Redis({
            host: 'localhost', // Địa chỉ máy chủ Redis
            port: 6379,        // Cổng Redis
          });
    }

    handleConnection(client: Socket, ...args: any[]) {
        const sockets = this.io.sockets;

        this.logger.log(`WS Client with id: ${client.id} connected!`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);


        const redisClient = new Redis.Redis({
            host: 'localhost', // Địa chỉ máy chủ Redis
            port: 6379,        // Cổng Redis
          });
      
          // Lắng nghe các tin nhắn từ Redis và gửi đến kết nối WebSocket
          redisClient.subscribe('chat');
          redisClient.on('message', (_, message) => this.handleRedisMessage(message));
    }

    handleDisconnect(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`Disconnected socket id: ${client.id}`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() data: { text: string }) {
        // Gửi tin nhắn từ WebSocket tới Redis 'chat'
        await this.redisPublisher.publish('chat', JSON.stringify(data));
    }

    handleRedisMessage(message) {
        // Phát sóng tin nhắn từ Redis đến tất cả kết nối WebSocket
        console.log(message);
    }
}
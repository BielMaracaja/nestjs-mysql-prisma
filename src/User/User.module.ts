import { Module, NestModule, MiddlewareConsumer, RequestMethod, forwardRef} from "@nestjs/common";
import { AuthModule } from "src/auth/Auth.module";
import { UserIdCheckMiddleware } from "src/middlewares/User-id-check.middleware";
import { PrismaModule } from "src/prisma/Prisma.module";
import { UserController } from "./User.controller";
import { UserService } from "./User.service";

@Module({
    imports:[PrismaModule, forwardRef(() => AuthModule)],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserIdCheckMiddleware).forRoutes({
            path: 'users/:id',
            method: RequestMethod.ALL
        });
    }
}
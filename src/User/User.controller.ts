import { Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { ParamId } from "src/decorators/Param-id.decorator";
import { Roles } from "src/decorators/Roles.decorator";
import { Role } from "src/enum/Role.enum";
import { AuthGuard } from "src/guards/Auth.guard";
import { RoleGuard } from "src/guards/Role.guard";
import { LogInterceptor } from "src/interceptors/Log.interceptor";
import { CreateUserDTO } from "./dto/Create-user.dto";
import { UpdatePatchUserDTO } from "./dto/Update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/Update-put-user.dto";
import { UserService } from "./User.service";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController{

    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Get()
    async list() {
        return this.userService.list();
    }

    @Get(':id')
    async show(@ParamId() id: number) {
        console.log({id});
        return this.userService.show(id);
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data);
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.userService.delete(id);
    }

}
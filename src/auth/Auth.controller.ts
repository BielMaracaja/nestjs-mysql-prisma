import { Body, Controller, Post, Headers, UseGuards, UseInterceptors, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { UploadedFile, UploadedFiles } from '@nestjs/common/decorators';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from 'src/decorators/User.decorator';
import { AuthGuard } from 'src/guards/Auth.guard';
import { UserService } from 'src/User/User.service';
import { AuthService } from './Auth.service';
import { AuthForgetDTO } from './dto/Auth-forget.dto';
import { AuthLoginDTO } from './dto/Auth-login.dto';
import { AuthRegisterDTO } from './dto/Auth-register.dto';
import { AuthResetDTO } from './dto/Auth-reset.dto';
import { join } from 'path';
import { FileService } from 'src/file/File.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService) {}

    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO) {
        return this.authService.login(email, password);
    }
    
    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO) {
        return this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO) {
        return this.authService.reset(password, token)
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user) {
        return {user};
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
            @User() user, 
            @UploadedFile(new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: 'image/jpeg'}),
                    new MaxFileSizeValidator({maxSize: 1024 * 1000})
                ]        
        })) photo: Express.Multer.File) {
        const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`);
        try {
            await this.fileService.upload(photo, path);
        }
        catch(e) {
            throw new BadRequestException(e);
        }
        return {photo};
    }

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
        return files;
    }

    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
        }, {
            name: 'documents',
            maxCount: 10
        }
    ]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {
        return files;
    }
}
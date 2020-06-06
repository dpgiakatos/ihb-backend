import {
    Controller,
    Delete,
    Get,
    NotImplementedException,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { UsersService } from '../users/users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../auth/decorators/user.decorator';
import { Claims, Role } from '../auth/models/claims.interface';
import { ApplicationBindings } from './application.bindings';
import { rename, unlink } from 'fs';
import { Roles } from '../auth/decorators/roles.decorator';

@Auth
@Controller('application')
export class ApplicationController {
    constructor(private applicationService: ApplicationService, private usersService: UsersService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: ApplicationBindings, @User() claims: Claims) {
        try {
            await this.usersService.assertExists(claims.id);
            await this.applicationService.assertExists(claims.id);
            const splitFile = file.originalname.split('.');
            const suffix = splitFile[splitFile.length - 1];
            await rename(file.path, file.destination + '\\' + claims.id + '.' + suffix, async (err) => {
                if (err) {
                    throw new NotImplementedException();
                } else {
                    await this.applicationService.upload(claims, suffix);
                }
            });
        } catch (e) {
            await unlink(file.path, (err) => {
                if (err) {
                    throw new NotImplementedException();
                }
            });
            throw e;
        }
    }

    @Get(':userId')
    @Roles(Role.Administrator)
    async getFileName(@Param('userId') id: string) {
        try {
            await this.usersService.assertExists(id);
            await this.applicationService.assertExists(id);
            return await this.applicationService.getFileName(id);
        } catch (e) {
            throw e;
        }
    }

    @Get('all')
    @Roles(Role.Administrator)
    async getApplications(@Query('page') page = 1) {
        return await this.applicationService.getApplications(page);
    }

    @Delete(':applicationId/delete')
    @Roles(Role.Administrator)
    async delete(@Param('applicationId') applicationId: string) {
        await this.applicationService.delete(applicationId);
    }
}

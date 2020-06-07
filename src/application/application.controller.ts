import {
    Controller,
    Delete,
    Get,
    NotImplementedException,
    Param,
    Post,
    Query,
    Res,
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
import { Response } from 'express';

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
            if (suffix !== 'zip') {
                throw new NotImplementedException();
            }
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

    @Get('hasApplication')
    async hasApplication(@User() claims: Claims) {
        return await this.applicationService.hasApplication(claims.id);
    }

    @Get('get-all')
    @Roles(Role.Administrator)
    async getApplications(@Query('page') page = 1) {
        const [applications, count] = await this.applicationService.getApplications(page);
        return { applications, count };
    }

    @Get(':userId/download')
    @Roles(Role.Administrator)
    async getFileName(@Param('userId') id: string, @Res() res: Response) {
        await this.usersService.assertExists(id);
        await this.applicationService.assertExists(id);
        const file = await this.applicationService.getFileName(id);
        return res.download('./applications/'+file);
    }

    @Get(':userId/hasApplication')
    @Roles(Role.Administrator)
    async hasUserApplication(@Param('userId') id: string) {
        await this.usersService.assertExists(id);
        return await this.applicationService.hasApplication(id);
    }

    @Delete(':userId/delete')
    @Roles(Role.Administrator)
    async delete(@Param('userId') id: string) {
        await this.usersService.assertExists(id);
        await this.applicationService.assertExists(id);
        await this.applicationService.delete(id);
    }
}

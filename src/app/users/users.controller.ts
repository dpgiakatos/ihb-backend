import { Controller, Param, Body, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ChangePasswordBindings } from './users.bindings';

@Auth
@Controller('user')
export class UsersController {

    constructor(
        private userService: UsersService
    ) { }

    @Put(':userId/change-password')
    async getUser(
        @Param('userId') id: string,
        @Body() password: ChangePasswordBindings
    ): Promise<void> {
        console.log(password)
        await this.userService.assertExists(id);
        await this.userService.changePasswordWithOldPassword(id, password.oldPassword, password.password);
    }
}


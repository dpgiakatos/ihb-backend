import { Controller, Param, Body, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordBindings } from './password/password.bindings';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth
@Controller('user')
export class UsersController {

    constructor(
        private userService: UsersService
    ) { }

    @Put(':userId/change-password')
    async getUser(
        @Param('userId') id: string,
        @Body() password: PasswordBindings
    ): Promise<void> {
        console.log(password)
        await this.userService.assertExists(id);
        await this.userService.changePasswordWithOldPassword(id, password.oldPassword, password.password);
    }
}


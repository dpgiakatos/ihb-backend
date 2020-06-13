import { Controller, Param, Body, Put, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ChangePasswordBindings } from './users.bindings';
import { User } from '../../auth/decorators/user.decorator';
import { Claims } from '../../auth/models/claims.interface';

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
        await this.userService.assertExists(id);
        await this.userService.changePasswordWithOldPassword(id, password.oldPassword, password.password);
    }

    @Delete('delete')
    async delete(@User() claims: Claims) {
        const user = await this.userService.findOneById(claims.id);
        if (!user) {
            throw new NotFoundException();
        }
        await this.userService.delete(user);
    }
}


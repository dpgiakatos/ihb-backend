import { Controller, Body, Put, Delete, NotFoundException } from '@nestjs/common';
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

    @Put('change-password')
    async getUser(
        @User() claims: Claims,
        @Body() password: ChangePasswordBindings
    ): Promise<void> {
        await this.userService.changePasswordWithOldPassword(claims.id, password.oldPassword, password.password);
    }

    @Delete()
    async delete(@User() claims: Claims) {
        const user = await this.userService.findOneById(claims.id);
        if (!user) {
            throw new NotFoundException();
        }
        await this.userService.delete(user);
    }
}


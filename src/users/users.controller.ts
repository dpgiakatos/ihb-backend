import { Controller, Param, Body, Put } from '@nestjs/common';
import { VaccinationsService } from './vaccinations/vaccinations.service';
import { UsersService } from './users.service';
import { PasswordBindings } from './password/password.bindings';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth
@Controller('user')
export class UsersController {

    constructor(
        private vaccinationsService: VaccinationsService,
        private userService: UsersService
    
    ) { }

    @Put(':userId/change-password')
    async getUser(
        @Param('userId') id: string,
        @Body() password: PasswordBindings
    ): Promise<void> {
        console.log(password)
        await this.userService.assertExists(id);
        await this.userService.editPassword(id, password.oldPassword, password.password);
    }
}


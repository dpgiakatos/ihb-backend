import { Controller } from '@nestjs/common';
import { VaccinationsService } from './vaccinations/vaccinations.service';

@Controller('user')
export class UsersController {

    constructor(private vaccinationsService: VaccinationsService) { }

}

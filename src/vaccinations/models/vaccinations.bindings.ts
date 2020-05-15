export class AddExtraVaccinationsBindingModel {
    name: string;

    date: VaccinationDate;

    description: string;
}

export class VaccinationDate {
    year: number;

    month: number;

    day: number;
}
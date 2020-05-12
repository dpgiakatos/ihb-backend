import { Test, TestingModule } from '@nestjs/testing';
import { PersonalController } from './personal.controller';

describe('Personal Controller', () => {
  let controller: PersonalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalController],
    }).compile();

    controller = module.get<PersonalController>(PersonalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

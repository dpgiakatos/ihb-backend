import { Test, TestingModule } from '@nestjs/testing';
import { AllergicController } from './allergic.controller';

describe('Allergic Controller', () => {
  let controller: AllergicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllergicController],
    }).compile();

    controller = module.get<AllergicController>(AllergicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
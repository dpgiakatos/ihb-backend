import { Test, TestingModule } from '@nestjs/testing';
import { AllergicService } from './allergic.service';

describe('AllergicService', () => {
    let service: AllergicService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [AllergicService],
      }).compile();
  
      service = module.get<AllergicService>(AllergicService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
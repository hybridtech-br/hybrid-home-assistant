import { IsArray, IsIn, IsString, MinLength } from 'class-validator';

export class CreateOnboardingDto {
  @IsIn(['resident', 'integrator'])
  profile!: 'resident' | 'integrator';

  @IsString()
  @MinLength(2)
  homeName!: string;

  @IsArray()
  @IsString({ each: true })
  priorities!: string[];
}

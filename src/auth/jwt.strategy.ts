// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';
import { Patient } from 'src/patients/schemas/patient.schema';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(Patient.name) private patientModel: Model<Patient>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Payload:', payload); 

    const patient = await this.patientModel.findOne({ phoneNumber: payload.id });

    console.log("VALIDATE PATIENT", patient);
    if (!patient) {
      throw new UnauthorizedException();
    }
    return patient;
  }
}

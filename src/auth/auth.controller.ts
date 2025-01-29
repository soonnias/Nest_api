// auth.controller.ts
import { Controller, Post, Body, Res, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({ status: 201, description: 'Користувач успішно зареєстрований' })
  @ApiResponse({ status: 400, description: 'Помилка у вхідних даних' })
  async register(@Res() res, @Body() registerDto: RegisterDto) {
    const { patient, token } = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'User successfully registered',
      patient,
      token,
    });
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Авторизація користувача' })
  @ApiResponse({ status: 200, description: 'Користувач успішно авторизований' })
  @ApiResponse({ status: 400, description: 'Невірний логін або пароль' })
  async login(@Res() res, @Body() loginDto: LoginDto) {
    const { token } = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json({
      message: 'User successfully logged in',
      token,
    });
  }
}

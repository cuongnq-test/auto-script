import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('hello')
  @HttpCode(204)
  doHello(@Req() request: Request, @Body() body: any): void {
    console.log(' ->  body', body);
    console.log(request);
  }
}

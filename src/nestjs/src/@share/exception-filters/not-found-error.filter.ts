import { NotFoundError } from '@fm/micro-videos/@seedwork/domain';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(404).json({
      status: 404,
      error: 'Not Found',
      message: exception.message
    });
  }
}

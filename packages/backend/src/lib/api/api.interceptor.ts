import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable, catchError, map, of } from 'rxjs'
import { Api } from './api'

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  private responseHandler(res: Pick<Api, 'data' | 'message' | 'meta'>, context: ExecutionContext) {
    const ctx = context.switchToHttp()

    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    if (response.headersSent) {
      return
    }

    const status = HttpStatus.OK as number
    response.status(status).json({
      status: true,
      statusCode: status,
      path: request.url,
      data: res.data,
      meta: res.meta,
      message: res.message,
      timestamp: new Date().toISOString(),
    })
  }

  private errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const isDebugging = request.headers['x-custom-debug']

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const result = exception.cause
      ? exception.cause
      : (exception?.getResponse?.() as any)?.signalValidationPipe
        ? (exception?.getResponse?.() as any).errors
        : exception instanceof HttpException
          ? null
          : null

    return response.status(status).json({
      data: result,
      status: false,
      statusCode: status,
      path: request.url,
      meta: {},
      timestamp: new Date().toISOString(),
      message: exception.message ?? 'Error',
      stack: isDebugging ? exception.stack : undefined,
      name: isDebugging ? exception.name : undefined,
    })
  }

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<any> {
    return next.handle().pipe(
      map((res) => this.responseHandler(res as any, context)),
      catchError((err) => {
        this.errorHandler(err, context)
        return of(null)
      }),
    )
  }
}

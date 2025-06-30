import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'

export interface ApiPipeException {
  signalValidationPipe: boolean
  errors: (ValidationError & { messages: string[] })[]
}

export class ApiPipe {
  private static simpleErrors(errors: ValidationError[]) {
    const formatErrors = (errs: ValidationError[], parentKey = ''): Record<string, string> => {
      return errs.reduce((groupErrors, error) => {
        const key = parentKey ? `${parentKey}.${error.property}` : error.property;
  
        if (error.children && error.children.length > 0) {
          return { ...groupErrors, ...formatErrors(error.children, key) };
        }
  
        return {
          ...groupErrors,
          [key]: Object.values(error.constraints ?? {}).join(', '),
        };
      }, {} as Record<string, string>);
    };
  
    return formatErrors(errors);
  }

  private static complexErrors(errors: ValidationError[]) {
    const result = errors.map((error) => {
      return {
        ...error,
        messages: Object.values(error.constraints ?? {}),
      }
    })

    return result
  }

  static create() {
    return new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      exceptionFactory(originalErrors) {
        const errors = ApiPipe.simpleErrors(originalErrors)
        return new BadRequestException({
          signalValidationPipe: true,
          errors,
        })
      },
    })
  }
}

import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

export const validateErrors = (error: any, message: string) => {
  if (error.code === '23505') {
    throw new BadRequestException({
      error: {
        table: error.table,
        code: error.code,
        detail: error.detail,
      },
      message,
    });
  }

  throw new InternalServerErrorException({
    error: {
      table: error.table,
      code: error.code,
      detail: error.detail,
    },
    message: 'Error inesperado, verifique los registros del servidor',
  });
};

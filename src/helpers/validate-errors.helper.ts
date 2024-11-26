import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const validateErrors = (error: any, entity: string) => {
  if (error.code === '23505') {
    throw new BadRequestException({
      ok: false,
      error: {
        table: error.table,
        code: error.code,
        detail: error.detail,
      },
      message: `Ya existe una ${entity} con ese nombre`,
    });
  }

  throw new InternalServerErrorException({
    ok: false,
    error: {
      table: error.table,
      code: error.code,
      detail: error.detail,
    },
    message: 'Error inesperado, verifique los registros del servidor',
  });
};

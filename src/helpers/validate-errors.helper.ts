import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

export const validateErrors = (error: any, message = '') => {
  if (error.code === '23505') {
    throw new BadRequestException([message]);
  }

  throw new InternalServerErrorException(
    'Error inesperado, verifique los registros del servidor',
  );
};

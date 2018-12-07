import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ActorsDao } from '../model/actors.dao';
import { neverNullable } from '../../../util';
import { applyHostname } from '../model/actors.helpers';

export const getActorEffect$: Effect = req$ =>
  req$.pipe(
    mergeMap(req => of(req.params.id).pipe(
      mergeMap(ActorsDao.findOneByImdbID),
      mergeMap(neverNullable),
      map(applyHostname(req)),
      map(actor => ({ body: actor })),
      catchError(() => throwError(
        new HttpError('Actor does not exist', HttpStatus.NOT_FOUND)
      ))
    ))
  );
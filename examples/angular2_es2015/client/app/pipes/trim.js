'use strict';
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'trim'})
export class TrimPipe implements PipeTransform {
  transform(value, args) {
    return value.trim();
  }
}

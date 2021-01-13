import { TestBed } from '@angular/core/testing';

import { TodoStoreService } from './todo-store.service';

describe('TodoStoreService', () => {
  let service: TodoStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

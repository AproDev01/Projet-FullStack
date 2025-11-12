import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      on: jasmine.createSpy('on'),
      off: jasmine.createSpy('off')
    };

    TestBed.configureTestingModule({
      providers: [SocketService]
    });

    service = TestBed.inject(SocketService);
    (service as any).socket = mockSocket;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call socket.on when listening to an event', () => {
    service.onlisten('update').subscribe();
    expect(mockSocket.on).toHaveBeenCalledWith('update', jasmine.any(Function));
  });
it('should remove listener on unsubscribe', () => {
  let savedCallback: Function | null = null;

  // Capture le callback passé à socket.on
  mockSocket.on.and.callFake((event: string, cb: Function) => {
    savedCallback = cb;
  });

  const subscription = service.onlisten('update').subscribe();

  // Appelle unsubscribe pour déclencher la fonction de cleanup
  subscription.unsubscribe();

  // Vérifie que off a été appelé avec le bon callback
  expect(mockSocket.off).toHaveBeenCalledWith('update', savedCallback);
});
});

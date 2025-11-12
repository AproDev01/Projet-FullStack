import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { LogInterceptor } from './log.interceptor';
import { of } from 'rxjs';

describe('LogInterceptor', () => {
  let interceptor: LogInterceptor;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogInterceptor]
    });

    interceptor = TestBed.inject(LogInterceptor);
    http = TestBed.inject(HttpClient);
     // Token JWT factice avec payload { id: 'user123' }
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMifQ.fake'
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });

it('should send a log on POST request', (done) => {
  spyOn(interceptor['http'], 'post').and.returnValue(of({}));

  // HttpRequest POST normal
  const req = new HttpRequest('POST', '/etudiants', { id: 1 });

  // next.handle() renvoie un HttpResponse pour déclencher le tap
  const next: any = {
    handle: () => of(new HttpResponse({ status: 200, body: {} }))
  };

  interceptor.intercept(req, next).subscribe(() => {
    expect(interceptor['http'].post).toHaveBeenCalledWith(
      'http://localhost:3000/logs',
      jasmine.objectContaining({ actionType: 'ajout', etudiantId: 1 }),
      jasmine.any(Object)
    );
    done();
  });
});

  it('should send a log on PUT request', (done) => {
    spyOn(interceptor['http'], 'post').and.returnValue(of({}));

    const req = new HttpRequest('PUT', '/etudiants/1', { id: 1 });
    const next: any = { handle: () => of(new HttpResponse({ status: 200, body: {} })) };

    interceptor.intercept(req, next).subscribe(() => {
      expect(interceptor['http'].post).toHaveBeenCalledWith(
        'http://localhost:3000/logs',
        jasmine.objectContaining({ actionType: 'modification', etudiantId: 1, userId: 'user123' }),
        jasmine.any(Object)
      );
      done();
    });
  });

  it('should send a log on DELETE request', (done) => {
    spyOn(interceptor['http'], 'post').and.returnValue(of({}));

    const req = new HttpRequest('DELETE', '/etudiants/1');
    const next: any = { handle: () => of(new HttpResponse({ status: 200, body: {} })) };

    interceptor.intercept(req, next).subscribe(() => {
      expect(interceptor['http'].post).toHaveBeenCalledWith(
        'http://localhost:3000/logs',
        jasmine.objectContaining({ actionType: 'suppression', etudiantId: null, userId: 'user123' }),
        jasmine.any(Object)
      );
      done();
    });
  });

  it('should not send log if URL includes /logs', (done) => {
    spyOn(interceptor['http'], 'post');

    const req = new HttpRequest('POST', '/logs', { id: 1 });
    const next: any = { handle: () => of(new HttpResponse({ status: 200, body: {} })) };

    interceptor.intercept(req, next).subscribe(() => {
      expect(interceptor['http'].post).not.toHaveBeenCalled();
      done();
    });
  });
});

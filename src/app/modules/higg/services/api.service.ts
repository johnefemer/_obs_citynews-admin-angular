import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { PageService } from './page.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiService {
  baseUrl: string;
  localUrl: string;

  constructor(private http: HttpClient, private router: Router, private page: PageService) {
    this.baseUrl = environment.baseUrl;
    this.localUrl = environment.localUrl;
    // console.log(environment.production);
  }

  get apiUrl(): string {
    return this.baseUrl + '/api';
  }

  url(urlSegment: string): string {
    return this.apiUrl + urlSegment;
  }

  req(url: string, body: {} = {}, withToken = true) {
    const headers = this.httpOptions(withToken);
    return this.http.post(this.url(url), body, headers).pipe(
      map(results => {
        return results; // ['data'] || null;
      }),
      catchError(this.handleError('url', null))
    );
  }

  local(url: string, body: {} = {}, withToken = true) {
    const headers = this.httpOptions(withToken);
    return this.http.post(this.localUrl + '/api' + url, body, headers).pipe(
      map(results => {
        return results; // ['data'] || null;
      }),
      catchError(this.handleError('url', null))
    );
  }

  browse(path, body: {} = {}) {
    return this.req('/browser/' + path, body);
  }

  action(path, body: {} = {}) {
    return this.req('/action/' + path, body);
  }

  form(path, body: {} = {}) {
    return this.req('/form/' + path, body);
  }

  data(url: string, body: {} = {}) {
    const headers = this.httpOptions();
    return this.http.post(this.url(url), body, headers).pipe(
      map(results => {
        if (!results['error']) {
          return results['data'] || null;
        }
        this.page.toastr(results['error'], 'error');
        return null;
      }),
      catchError(this.handleError('url', null))
    );
  }

  login(identity: string, password: string) {
    const body = { data: { identity: identity, password: password } };
    const headers = this.httpOptions(false);
    // return this.http.post(this.apiUrl + '/api/action/person.login', JSON.stringify({ data: { identity: identity, password: password } }))
    return this.http.post(this.url('/action/person.login'), body, headers).pipe(
      map(result => {
        // console.log('calling pipe: map');
        if (!result['error']) {
          const user = result['data'];
          if (user && user['accessToken']) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            console.error('accessToken missing for authorized user.');
          }
        } else {
          console.error(result['error']);
        }
        return result;
      })
    );
    /*
    .map((response: Response) => {
      // login successful if there's a jwt token in the response
      // const user = response.json();
      const result = response.json();
      // console.log(result);
      if (!result['error']) {
        const user = result['data'];
        if (user && user.accessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      } else {
        console.error(result['error']);
      }
      return result;
    });
    */
  }

  verify() {
    return this.http.get(this.url('/verify'), this.httpOptions()).pipe(
      map(results => {
        if (!results['error']) {
          return results['data'] || [];
        }
        return null;
      }),
      catchError(this.handleError('verify', null))
    );
  }

  httpOptions(withToken = true) {
    let options = { 'Content-Type': 'application/json' };
    if (withToken) {
      const jwtHeaders = this.jwtToken();
      options = Object.assign(options, jwtHeaders);
    }
    const httpOptions = {
      headers: new HttpHeaders(options)
    };
    return httpOptions;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      // console.log(error);
      if (error.status === 500) {
        console.error(error);
        // this.router.navigateByUrl('/login');
      }
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private jwtToken() {
    // create authorization header with jwt token
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = this.getAuthToken();
    // if (currentUser && currentUser.accessToken) {
    if (accessToken) {
      return { Authorization: 'Bearer ' + accessToken };
      // const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.accessToken });
      // return new RequestOptions({ headers: headers });
    }
  }

  getAuthToken() {
    const currentUser = JSON.parse(localStorage.getItem('user_current'));
    if (currentUser && currentUser.token) {
      return currentUser.token;
    }
    return false;
  }
}

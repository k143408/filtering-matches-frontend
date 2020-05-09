import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

import {User} from "../response/user";
import {Filter} from "../request/filter";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }


  public getRandomLoginUser(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + 'users/randomisation')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  fetchBasedOnFilter(filter: Filter, longitude: number, latitude: number): Observable<any> {
    let httpParams = this.toHttpParams(filter);
    httpParams = httpParams.append("longitude", longitude.toString());
    httpParams = httpParams.append("latitude", latitude.toString());
    return this.http.get<Filter>(environment.apiUrl + 'users', {params: httpParams})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  private toHttpParams(query: Filter): HttpParams {
    let params: HttpParams = new HttpParams();
    for (const key of Object.keys(query)) {
      if (query[key] instanceof Array) {
        query[key].forEach((item) => {
          params = params.append(`${key.toString()}`, item);
        });
      } else {
        params = params.append(key.toString(), query[key]);
      }
    }
    return params;
  }

  private handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerForgeConnectionService {

  private url: string;
  private options: HttpHeaders;

  constructor(public http: HttpClient) {
    this.options = new HttpHeaders();
    this.options = this.options.set('Content-Type', 'application/json');

    const port = window.location.port === '' ? '' : `:${window.location.port}`;
    this.url = `http://${window.location.hostname}${port}/truck-forge/auth`;
  }

  public get(header: HttpHeaders): Observable<any> {
    const requestOptions = {
      headers: header
    };
    return this.http.get(this.url, requestOptions);
  }

  async getData() {
    return this.get(this.options).toPromise();
  }
}

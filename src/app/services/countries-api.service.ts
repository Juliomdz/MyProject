import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesApiService {

  urlApi:string = 'https://restcountries.com/v3.1/all'

  constructor(private httpClient:HttpClient) { }

  TraerPaises():Observable<any>
  {
    return this.httpClient.get<any>(this.urlApi)
  }
}
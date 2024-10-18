import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  
  apiUrl = 'http://13.229.74.53:8080';
  // apiUrl = 'http://localhost:8080';

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getFloorByLvl(floor) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/room/floor?floorLvl='+floor).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getRoomById(roomId){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/room?id='+roomId).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFloors(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/floor/all').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  reserveRoom(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/room/reserve', JSON.stringify(data), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  checkoutRoom(roomId) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl+'/room/checkout?roomId='+roomId).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  checkinRoom(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/room/checkin', JSON.stringify(data), {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}

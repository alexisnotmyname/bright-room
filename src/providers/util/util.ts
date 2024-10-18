import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilProvider {

  constructor(public http: HttpClient) {
  }

  uint8ArrayToString(uint8Array) :any{
    let result = '';
    if(uint8Array){
      for(let i=0;i<uint8Array.length;i++){
        result += this.format(uint8Array[i]);
      }
    }  
    return result;
  }

  format(x) {
    let hex = x.toString(16);
    return hex.length < 2 ? '0' + hex : hex;
  }
  computeDistance(data): any{
    if(data.bid!=0){
      let param = (data.txPower - data.rssi)/ (10*2);
      let distance = Math.pow(10, param)
      return distance;
    }else {
      return 9999999;
    }
    
  }

}

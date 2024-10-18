import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
/*
  Generated class for the TimerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimerProvider {

  constructor(public datepipe: DatePipe) {
  }

  computeRemainingTime(endTimeStamp) {

    // const timeEnd:any = new Date(endTimeStamp).toISOString();
    // const timeNow:any = new Date(new Date().toISOString());
    
    let timeEnd = moment(endTimeStamp);
    let timeNow = moment();
    let duration = moment.duration(timeEnd.diff(timeNow))

    console.log('endTime:',timeEnd)
    console.log('timeNow:', timeNow)

    let timeRemaining = duration.asSeconds()
    console.log('timeRemaining:',timeRemaining);

    return timeRemaining;
  }

  getRemainingTimeMins(timestamp) {
    const minutes = Math.floor(this.computeRemainingTime(timestamp)/60);
    return minutes; 
  }

  displayRemainingTime(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    let minutesString = '';
    let secondsString = '';
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return  minutesString + ':' + secondsString;
  }

}

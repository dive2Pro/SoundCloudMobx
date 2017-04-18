const cloneDeep = require('lodash/cloneDeep')
const assignInWith = require('lodash/assignInWith')

import {
  observable,
  // extendObservable
} from 'mobx'

export function seconds2time(seconds: number): string {
  let days = Math.floor(seconds / (3600 * 24));
  const delDaysSeconds = (days * (3600 * 24))
  let hours = Math.floor((seconds - delDaysSeconds) / 3600);

  let minutes = Math.floor((seconds - (hours * 3600) - delDaysSeconds) / 60);
  let nowSeconds = seconds - delDaysSeconds - (hours * 3600) - (minutes * 60);
  let time = '';
  if (days != 0) {
    time = days + ':'
  }
  if (hours != 0) {
    time = hours + ':';
  }
  let cacuMinutes = ''
  if (minutes != 0 || time !== '') {
    cacuMinutes = (minutes < 10 && time !== '') ? '0' + minutes : String(minutes);
    time += cacuMinutes + ':';
  }
  if (time === '') {
    time = nowSeconds + 's';
  } else {
    time += (nowSeconds < 10) ? '0' + nowSeconds : String(nowSeconds);
  }
  return time;
}

export function transBigMath(value: number): string {
  if (!value) { return '0' }
  if (value < 1000) {
    return value + '';
  }
  if (value < 1000000) {
    let v = (value / 1000).toFixed(0)
    return v + 'k'
  }

  let v = +(value / 1000000).toFixed(2)
  if (v >= 1) {
    return v + 'm'
  }
  v = value - v * 1000000;
  v = +(v / 1000).toFixed(2);
  return (v + 'k')
}

export const extendsObservableObjFromJson = (target: any, data: any) => {
  assignInWith(target, cloneDeep(data))
  let p = '';
  // observable(target
  // , p, { value: target[p] }
  // )
  for (p in target) {
    observable(target, p, observable({ p: target[p] })
    )
  }

}

export const specTimeTamp = (date: string): string => {
  const now = new Date()
  const spec = new Date(date)
  const dateArr = date.split(" ")
  if (now.getFullYear() == spec.getFullYear() &&
    now.getMonth() == spec.getMonth() + 1 &&
    now.getDay() == spec.getDay()) {
    return dateArr[1]
  }
  return dateArr[0]
}


export const findRootParentOffSet = (root: any) => {
  while ((root = root.parentNode) != null) {
    // console.log('recatroot' in root.dataset)
    if (root.parentNode && root.parentNode.dataset &&
      root.parentNode.dataset.reactroot != null) {
      break;
    }
  }
  return root.offsetLeft || 0
}
// import { time } from "console"

// const date=new Date()
// // const date1=
// const a=Intl.DateTimeFormat("en-UK", {year: "numeric", month: "2-digit",day: "2-digit", hour: "2-digit", minute: "2-digit"}).format(date)
// // const b=Intl.DateTimeFormat("en-UK", {year: "numeric", month: "2-digit",day: "2-digit", hour: "2-digit", minute: "2-digit"}).format(date1)
// console.log(a)
// // console.log(date1.toString())
// console.log(date.toTimeString())
// console.log(date.toTimeString()<"24:62:00") 

import nodeConfig from "config";

const m = nodeConfig.get('mqttUser');
console.log(m);
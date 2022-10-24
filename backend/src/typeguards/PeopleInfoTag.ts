
/*
This interface used to save people information
ID: People ID number,
Section: which section people work in,
name: full name,
photo: src of photo,
job: job title,
date: date of sign in,
time: time of sign in,
isDayShift: nightshift or day shift.
*/
"use strict";
interface PeopleInfoTag {
    ID: string | undefined | null;
    section: string | undefined | null;
    name: string | undefined | null;
    photo: string | undefined | null;
    job: string | undefined | null;
    date: string | undefined | null;
    time: string | undefined | null;
    isDayShift: boolean | undefined | null;
}
export { PeopleInfoTag }
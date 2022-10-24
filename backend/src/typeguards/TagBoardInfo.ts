"use strict";
import { LampInfo } from "./LampInfo";
import { PeopleInfoTag } from "./PeopleInfoTag";
/*
person: save people information,
lamp: save lamp information.
*/
interface TagBoardInfo {
    person: PeopleInfoTag;
    lamp: LampInfo;
}
export { TagBoardInfo }
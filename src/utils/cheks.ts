import {RefinedResponse} from "k6/http";
import {check, Checkers} from "k6";


export function checkStatusCodeIs(statusCode: number, resp: RefinedResponse<any>): void {
    const conditionSet: Checkers<any> = {}
    const key = `status is ${statusCode}`
    conditionSet[key] = (res: RefinedResponse<any>) => {
        return res.status === statusCode
    }
    check(resp, conditionSet)
}

export function checkBodyHaveLengthGte(length: number, resp: RefinedResponse<any>){
    const conditionSet: Checkers<any> = {}
    const key = `body length gte ${length}`
    conditionSet[key] = (res: RefinedResponse<any>) => {
        return JSON.parse(<string>res.body).length > 0
    }
    check(resp, conditionSet)
}

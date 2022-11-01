import {check, Checkers, fail} from "k6";
import {RefinedResponse} from "k6/http";

export class HttpResponse {
    conditionSet: Checkers<any>

    constructor(public resp: RefinedResponse<any>) {
        this.conditionSet = {}
    }

    public body<T = any>(){
        return JSON.parse(<string>this.resp.body) as T
    }

    public statusCodeIs(statusCode: number|undefined): HttpResponse {
        const key = `status is ${statusCode}`
        this.conditionSet[key] = (res) => res.status === statusCode
        this.runCheck(key, this.resp, this.conditionSet, { status: 'ok' })
        return this
    }

    public haveProperty(propertyName: string): HttpResponse {
        const key = `have property ${propertyName}`
        this.conditionSet[key] = (res) => res.json()!.hasOwnProperty(propertyName) //JSON.parse(<string>res.body).hasOwnProperty(propertyName)
        this.runCheck(key, this.resp, this.conditionSet)
        return this
    }

    runCheck(key: string, resp: RefinedResponse<any>, condSet: Checkers<any>, tags: object = {}){
        const passed = check(resp, condSet, tags)
        if (!passed){
            fail(`failed check '${key}' on request: ${this.resp.request.method}:${this.resp.request.url}`)
        }
    }
}

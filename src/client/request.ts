import {K6Resp} from "./response";
import http from "k6/http";


export class Http {


    static get(url: string, params: object){
        return new K6Resp(http.get(url, params))
    }

    static post(url: string, body: object, params: object){
        return new K6Resp(http.post(url, JSON.stringify(body), params))
    }

    static put(url: string, body: object, params: object){
        return new K6Resp(http.put(url, JSON.stringify(body), params))
    }
}

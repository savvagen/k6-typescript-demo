import {HttpResponse} from "./response";
import http from "k6/http";


export class HttpRequest {


    static get(url: string, params: object){
        return new HttpResponse(http.get(url, params))
    }

    static post(url: string, body: object, params: object){
        return new HttpResponse(http.post(url, JSON.stringify(body), params))
    }

    static put(url: string, body: object, params: object){
        return new HttpResponse(http.put(url, JSON.stringify(body), params))
    }
}

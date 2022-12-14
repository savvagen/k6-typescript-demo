import {defaultAuthParams, defaultAuthTokenParams, defaultParams} from "./index";
import {K6Resp} from "../client/response";
import http from "k6/http";
import {Post, User} from "../models";
import {Http} from "../client/request";
import {group, sleep} from "k6";
import {randomComment, randomPost, randomUser} from "../data/data.generator";
import {createComment} from "./post-reader.scn";

const BASE_URL = __ENV.BASE_URL !== undefined ? __ENV.BASE_URL: "http://localhost:3001"

export type TokenResp = { token: string }

export function getToken(): TokenResp {
    const params = {
        ...defaultAuthParams("test", "test"), tags: { name: "GET /get_token" }
    }
    return new K6Resp(http.get(`${BASE_URL}/get_token`, params))
        .statusCodeIs(200)
        .body<TokenResp>()
}

export function createUser(user: User, token: string) {
    const params = {
        ...defaultAuthTokenParams(token), tags: { name: "POST /users" }
    }
    return Http.post(`${BASE_URL}/users`, user, params)
        .statusCodeIs(201)
        .haveProperty("id")
        .body<User>()

}

export function createPost(post: Post) {
    const params = {
        ...defaultParams, tags: { name: "POST /posts" }
    }
    return Http.post(`${BASE_URL}/posts`, post, params)
        .statusCodeIs(201)
        .haveProperty("id")
        .body<Post>()

}

export function updatePost(id: number|undefined, comment: Post): Post {
    const params = {
        ...defaultParams, tags: { name: "PUT /posts/ID" }
    }
    return Http.put(`${BASE_URL}/posts/${id}`, comment, params)
        .statusCodeIs(200)
        .haveProperty("id")
        .body<Post>()
}

export function postWriterScn(){
    group("Writer Flow", ()=> {
        sleep(1)
        const tokenResp: TokenResp = getToken()
        //console.log(tokenResp.token)
        sleep(0.5)
        const user: User = createUser(randomUser(), tokenResp.token)
        //console.log(`Created User: ${user.id}`)
        sleep(2)
        const post: Post = createPost(randomPost(user.id))
        //console.log(`Created Post: ${post.id}`)
        sleep(2)
        for (let i = 0; i < 3; i++) {
            const commentId: number = createComment(randomComment(post.id, user.email))
            post.comments.push(commentId)
            const updated: Post = updatePost(post.id, post)
            //console.log(JSON.stringify(updated.comments))
            sleep(1)
        }
    })

}


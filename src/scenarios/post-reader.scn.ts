import http from "k6/http";
import {checkBodyHaveLengthGte, checkStatusCodeIs} from "../utils/cheks";
import {check,group, sleep} from "k6";
import {deserializeArray} from "class-transformer";
import {Comment, Post} from "../models";
import * as _ from "lodash";
import {K6Resp} from "../client/response";
import {Http} from "../client/request";
import {defaultAuthParams, defaultParams} from "./index";
import {randomComment} from "../data/data.generator";
// @ts-ignore
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js'
import {faker} from "@faker-js/faker/locale/en_US";

const BASE_URL = __ENV.BASE_URL !== undefined ? __ENV.BASE_URL: "http://localhost:3001"

export type PostsResp = {
    randomPost: number|undefined,
    posts: (number|undefined)[]
}
export function getPosts(): PostsResp {
    const params = {
        ...defaultParams, tags: { name: "GET /posts" }
    }
    const resp = http.get(`${BASE_URL}/posts`, params)
    checkStatusCodeIs(200, resp)
    checkBodyHaveLengthGte(1, resp)
    check(resp, { 'have property id': res => JSON.parse(<string>res.body)[0].hasOwnProperty('id') })
    const ids: Array<number|undefined> = deserializeArray(Post, <string>resp.body)
        .slice(0, 6)
        .map((post: Post) => post.id)
    return { randomPost: _.sample(ids), posts: ids }
}


export function getPost(id: number|undefined): Array<number>{
    const params = {
        ...defaultParams, tags: { name: "GET /posts/ID" }
    }
    const post = new K6Resp(http.get(`${BASE_URL}/posts/${id}`, params))
        .statusCodeIs(200)
        .haveProperty('id')
        .body<Post>()  //const post: Post = deserialize(Post, <string>resp.body)
    if (post.comments.length > 5) {
        return post.comments.slice(0,4).filter(id => id !== 0)
    }
    else {
        return post.comments.filter(id => id !== 0)
    }
}


export function getComment(id: number|undefined): number|undefined {
    const params = {
        ...defaultParams, tags: { name: "GET /comments/ID" }
    }
    return Http.get(`${BASE_URL}/comments/${id}`, params)
        .statusCodeIs(200)
        .haveProperty("id")
        .body<Comment>().id
}


export function createComment(comment: Comment): number {
    const params = {
        ...defaultParams, tags: { name: "POST /comments" }
    }
    return Http.post(`${BASE_URL}/comments`, comment, params)
        .statusCodeIs(201)
        .haveProperty("id")
        .haveProperty("email")
        .body().id
}

export function postReaderScn() {
    group("Reader Flow", ()=> {
        const postsResp: PostsResp = getPosts()
        sleep(1)
        postsResp.posts.forEach((id) => {
            getPost(id)
        })
        //console.log("RandomPost: " + postsResp.randomPost)
        //console.log("Posts: " + postsResp.posts)
        sleep(randomIntBetween(1, 3))
        const comments: Array<number> = getPost(postsResp.randomPost)
        //console.log("FoundComments: " + comments)
        comments.forEach(id => {
            getComment(id)
        })
        sleep(2)
        createComment(randomComment(postsResp.randomPost, faker.internet.email()))
        //console.log("CommentID: " + commentId)
    })

}

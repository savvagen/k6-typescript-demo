import {group, sleep} from "k6"
import { Options } from "k6/options"
import {randomComment, randomPost, randomUser} from "../data/data.generator"
import {faker} from "@faker-js/faker/locale/en_US"
import {createComment, getComment, getPost, getPosts, PostsResp} from "../scenarios/post-reader.scn"
import {createPost, createUser, getToken, TokenResp, updatePost} from "../scenarios/post-writer.scn"
// @ts-ignore
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js'
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js"
import {Comment, Post, User} from "../models";


export let options: Options = {
    vus: 1,
    iterations: 1,
    //duration: '30s',
    thresholds: {
        http_req_failed: ['rate<=0'], // During the whole test execution, the error rate must be equal to 0%.
        //http_req_failed: [{threshold: 'rate<=0', abortOnFail: true}], // Abort if there is more than 0% failed tests
        http_req_duration: ['p(95)<500'],
        checks: ['rate>=1'], // the rate of successful checks should be equal to 100%
        'checks{status:ok}': ['rate>0.99']
    },
    //httpDebug: "full"
}


export default ()=> {

    group("Reader Flow", ()=> {
        const postsResp: PostsResp = getPosts()
        sleep(1)
        postsResp.posts.forEach((id) => {
            getPost(id)
        })
        console.log("RandomPost: " + postsResp.randomPost)
        console.log("Posts: " + postsResp.posts)
        sleep(randomIntBetween(1, 3))
        const comments: Array<number> = getPost(postsResp.randomPost)
        console.log("FoundComments: " + comments)
        comments.forEach(id => {
            getComment(id)
        })
        sleep(2)
        const comment = randomComment(postsResp.randomPost, faker.internet.email())
        const commentId = createComment(comment)
        console.log("CommentID: " + commentId)

    })

    group("Writer Flow", ()=> {
        sleep(1)
        const tokenResp: TokenResp = getToken()
        console.log(tokenResp.token)
        sleep(0.5)
        const user: User = createUser(randomUser(), tokenResp.token)
        console.log(`Created User: ${user.id}`)
        sleep(2)
        const post: Post = createPost(randomPost(user.id))
        console.log(`Created Post: ${post.id}`)
        sleep(2)
        for (let i = 0; i < 3; i++) {
            const commentId: number = createComment(randomComment(post.id, user.email))
            post.comments.push(commentId)
            const updated: Post = updatePost(post.id, post)
            console.log(JSON.stringify(updated.comments))
            sleep(1)
        }
    })


}


export function handleSummary(data: object) {
    return {
        "result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}

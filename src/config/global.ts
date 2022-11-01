

type BaseUrl = string | "http://localhost:3001" | "http://json_server:3000"

type Config = {
    BASE_URL: BaseUrl
}

export const CONFIG: Config = {
    BASE_URL: process.env.BASE_URL !== undefined ? process.env.BASE_URL : "http://localhost:3001"
}

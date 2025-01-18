import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors' // 跨域
import { staticPlugin } from '@elysiajs/static' // 提供静态文件
import { jwt } from '@elysiajs/jwt' // token 验证
import { Database } from 'bun:sqlite' // 数据库
import { readdir } from 'node:fs/promises' // 读取文件目录
import path from 'node:path'

const db = new Database('zzzSQL')

const port: string | undefined = process.env.port
let server: string

if (port) {
  server = (+port + 1).toString()
} else {
  server = '5000'
}

const secret_key: string | undefined = process.env.JWT_SECRETS

console.log(`Bun server run on ${process.env.localIp}:${server}`)

type userData = {
  user: string
  password: string
}

new Elysia()
  .use(
    jwt({
      name: 'zzz',
      secret: secret_key as string,
      alg: process.env.JWT_ALG,
      exp: '7d'
    })
  )
  .use(
    cors({
      origin: ['localhost:5005', '127.0.0.1:3000'],
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    })
  )
  .use(staticPlugin({ assets: 'public/static', prefix: '/static' }))
  .get('/', () => 'Hello Elysia')
  .get('/File/*', ({ params }) => {
    const worksPath = decodeURIComponent(params['*'])
    const filePath = path.join('./public', worksPath)
    return Bun.file(filePath)
  })
  .get(
    '/getWorks',
    async () => {
      const ArrayWorks = [
        ['pictrueName'],
        ['pictrueURL'],
        ['worksName', 'upName', 'uploadDate']
      ]
      const worksPath = path.join(__dirname, '../public/static/worksFile')
      const files = await readdir(worksPath, { encoding: 'utf-8' })
      const worksData = files.map(data =>
        data.split('@').map(data => data.split('_'))
      )
      function shuffleArray(array: any) {
        for (let i = array.length - 1; i > 0; i--) {
          // 生成一个0到i之间的随机索引
          const j = Math.floor(Math.random() * (i + 1))
          // 交换当前元素与随机索引处的元素
          ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
      }
      const shuffledArray = shuffleArray([...worksData])
      const result = shuffledArray.map((data: any) => {
        let array2 = new Object()
        data.forEach((value: string[], i: number) => {
          value.forEach((v, index) => {
            array2[ArrayWorks[i][index]] = v
          })
        })
        return array2
      })
      return { worksData: result }
    },
    {
      response: t.Object({
        worksData: t.Array(
          t.Object({
            pictrueName: t.String(),
            pictrueURL: t.String(),
            worksName: t.String(),
            upName: t.String(),
            uploadDate: t.String()
          })
        )
      })
    }
  )
  .group('/user', app =>
    app
      .guard({
        response: t.Object({
          code: t.String(),
          msg: t.String(),
          data: t.String()
        })
      })
      .post(
        '/hasToken/:token',
        async ({ zzz, params: { token } }) => {
          // 获取token,解析
          const profile = await zzz.verify(token)
          if (profile) {
            return { code: '201', msg: 'login', data: '已登录' }
          }
          return { code: '502', msg: 'tokenError', data: '未经授权' }
        },
        {
          params: t.Object({
            token: t.String()
          })
        }
      )
      .post(
        '/login/:user/:password',
        async ({ zzz, params: { user, password } }) => {
          // 登录账户，验证密码,返回token
          async function getUserData(
            user: string
          ): Promise<userData | undefined> {
            const result = await db
              .query('select password from user where username=$user')
              .get({ $user: user })
            if (result && typeof result === 'object' && 'password' in result) {
              return {
                user: user,
                password: result.password as string
              }
            }
            return undefined
          }
          const userdata = await getUserData(user)
          if (!userdata) {
            return {
              code: '502',
              msg: '数据库中未找到该用户',
              data: '用户不存在'
            }
          }
          if (userdata.password === password) {
            const tokenData = await zzz.sign(userdata)
            return { code: '201', msg: '用户登录成功', data: tokenData }
          }
          return { code: '501', msg: '用户密码错误', data: '用户密码错误' }
        },
        {
          params: t.Object({
            user: t.String(),
            password: t.String()
          })
        }
      )
      .post(
        '/enroll/:user/:password',
        async ({ params: { user, password }, zzz }) => {
          const userdata = await db
            .query('select username from user where username=?1')
            .get(user)
          // 注册账户,返回token
          if (userdata) {
            return {
              code: '502',
              msg: '数据库中已有该用户',
              data: '用户已存在'
            }
          }
          db.query(
            'insert into user (username,password) values($user,$pass)'
          ).run({ $user: user, $pass: password })
          const tokenData = await zzz.sign({ password })
          return { code: '201', msg: '用户注册成功', data: tokenData }
        },
        {
          params: t.Object({
            user: t.String(),
            password: t.String()
          })
        }
      )
  )
  .onError(({ code, error }) => {
    if (code === 'VALIDATION') {
      return error.message
    }
    return error
  })
  .listen(server)

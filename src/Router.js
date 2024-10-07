import { createBrowserRouter,createRoutesFromElements,Route} from 'react-router-dom';
import App from './App.jsx';
import IP,{ port } from './data/localIp.js'
import { Novel, HomePage, Readepub, Article, Account, UserLyaout, AiApp, AiHomePage, ErrorPage } from './component/routers.js'

function parse_token({url,username,password}){
  return new Promise((reslove,reject)=>{
    fetch(`http://${IP}:${port}/${url}/${username}/${password}`,{method:"POST"}).then((res)=> reslove(res)).catch((error)=>reject(error))
  })
}

function check_token(){
  const token = localStorage.getItem('token')
  if (token){
    return true
  }
}

async function from_action({data,router}){
  const user = data.username; const password = data.password;
  const response = parse_token({url:`user/${router}`,username:`${user}`,password:`${password}`}).catch((error)=>{throw new Error(error)})
  const Json_data = await response.json()
  return Json_data
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route id='root' path='/' element={<App/>} errorElement={<ErrorPage />} >
        <Route index element={<HomePage/>} />
        <Route path='/novel' element={<Novel />} >
          <Route path='readepub/:id' element={<Readepub />} loader={async({params}) => { 
              const token = localStorage.getItem('token');
              const response = await fetch(`http://${IP}:${port}/user/hasToken/${token}`,{method:"POST"}).catch((error)=>{ throw new Response(error,{status:302,headers:{Location:'/?state=404'}}) });
              const { code, msg, data } = await response.json()
              if(code === "502"){
                if (token){
                  localStorage.removeItem('token')
                };
                throw new Response(null,{status:302,headers:{Location:`/novel/?state=${encodeURI(msg)}&msg=${encodeURI(data)}`}})
              }
              return params.id
              }} />
        </Route>
        <Route path='/article' element={<Article />} />
      </Route>
      {/* 用户 */}
      <Route id='User' element={ <UserLyaout/> } loader={()=>{ const state = check_token(); if (state){ throw new Response(null, {status: 302,headers: {Location: `/?state=login`,},});}; return null }}>
        <Route path='/account' element={<Account />} action={ async({request})=> { 
          const formAction = Object.fromEntries(await request.formData());
          const data = { username:formAction.username, password:formAction.password };
          if(formAction.formType === 'form1'){
            const state = await from_action({data:data,router:'login'}); return state
          }
          if(formAction.formType === 'form2'){
            const state = await from_action({data:data,router:'enroll'}); return state
          }
          }}></Route>
      </Route>
      <Route id="AiChat" path='/ai' element={<AiApp />}>
          <Route index element={<AiHomePage />}></Route>
      </Route>
    </>
  )
);

export { router };

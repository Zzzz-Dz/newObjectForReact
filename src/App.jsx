import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect,useContext, useRef } from 'react';
import { Outlet, Link,useLocation,useSearchParams  } from "react-router-dom";
import { toast,ToastContainer,Slide } from 'react-toastify';
import IP from './data/localIp'
import { UserContext } from './globalContext'
import { UserDispatchContext } from './globalContext'

function RouterComponent(){
  const state = useContext(UserContext)
  return (
    <>
      { state.isLogined ? <Link to="/user" className='p-1 hover:bg-gray-200 '>账户</Link> : <Link to="./account" className='p-1 hover:bg-gray-200 '>登录</Link>}
    </>
  )
}

function App() {
  let location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(location.search);
  const stateDispatch = useContext(UserDispatchContext); 
  const toastId = useRef(null);
  useEffect(()=>{
    const status = decodeURI(searchParams.get('state'))
    const msg = decodeURI(searchParams.get('msg'))
    if(!toast.isActive(toastId.current)){
      switch (status){
        case 'login':
          toastId.current = toast.success(msg)
          break;
        case 'tokenError':
          toastId.current = toast.warning(msg)
          break;
        case '404':
          toastId.current = toast.error('服务器未响应')
          break;
        default:
          break;
      }
    }
    return ()=>{
      setSearchParams('')
    }
  },[searchParams,setSearchParams])
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (token){
      stateDispatch({type:'islogined'}) 
    }
  },[stateDispatch])
  
  return (
    <>
    <ToastContainer position='top-center' autoClose={1000} closeButton={true} transition={Slide} hideProgressBar={true} pauseOnHover={true} pauseOnFocusLoss={false} closeOnClick={true} newestOnTop={true} role='alert' theme='light' />
    <div className="Main grid grid-flow-row h-screen bg-white relative">
      <nav className='z-50 fixed grid grid-flow-col grid-cols-[1,1fr] auto-rows-fr h-[3.5rem] w-full bg-white text-black content-center ring-1 ring-gray-200 ring-offset-[2px] ring-offset-gray-100 '>
        {/* 左侧导航栏 */}
        <nav className='left-nav grid grid-flow-col place-content-evenly relative min-w-[500px] text-sm font-medium'>
          <img src={`http://${IP}:5006/static/YanamiStand.png`} alt='not found' className='hidden xl:block w-8 h-full absolute left-10 animate-bounce ' onClick={()=> console.log('hello')} / >
          <Link to='/'>首页</Link>
          <Link to='/novel'>小说</Link>
          <Link to='/'>贴吧同人</Link>
          <Link to='/'>图片</Link>
          <Link to='/'>精品贴</Link>
        </nav>
        {/* 右侧用户行为栏 */}
        <div className='right-nav grid grid-flow-col grid-cols-1 place-items-center content-center'>
          <div className='flex flex-1 justify-center w-full'>
            <label htmlFor='serach' className="hidden md:block w-full max-h-10 max-w-[24rem] h-9 text-black/80 ">
              <input id='serach' type='text' className=' group border  rounded-md indent-2 w-full h-full opacity-80 bg-gray-200 hover:opacity-100 focus:opacity-100' />
              <div className='hidden  group-focus-within:block'>
                <p>123</p>
              </div>
            </label>
          </div>
          <div className='relative place-self-end flex items-center gap-2 px-4'>
            <p className="hidden md:block">八奈见</p>
            <div className='group'>
              <img src={`http://${IP}:5006/static/YanamiMeme.png`} alt='not found' className='min-w-10 min-h-10 group-hover:scale-125 transition group-hover:-translate-x-1 group-hover:translate-y-1 duration-200 ease-in-out h-10 w-10 rounded-full' />
              <div className='z-20 absolute indent-3 top-10 right-6 ring-1 py-4 ring-gray-200 text-black rounded-md bg-white h-auto flex gap-2 flex-col w-32 transition origin-top-right duration-100 ease-in scale-0 group-hover:scale-100'>
                <RouterComponent  />
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* 主体 */}
      <div className='body grid mt-[3.5rem] @container'>
        <Outlet />
      </div>
    </div>
    </>
  )
}

export default App;

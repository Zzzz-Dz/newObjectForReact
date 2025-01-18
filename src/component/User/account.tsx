import React from 'react'
import {
  Form,
  useNavigation,
  useActionData,
  useNavigate
} from 'react-router-dom'
import IP from '../../data/localIp.ts'
import { useEffect, useState, useContext } from 'react'
import { UserContext, type UserContextType } from '../../globalContext.tsx'
import { toast, ToastContainer, Slide } from 'react-toastify'
import { type ResponseMessage } from '../../types/user.ts'

function LoginForm({ set }) {
  return (
    <Form
      name="login"
      className="flex flex-col items-center gap-4 h-full justify-center relative z-20"
      method="post"
    >
      <input type="hidden" name="formType" value="form1" />
      <label className="tracking-widest">
        <span className="px-2">账户</span>
        <input
          type="text"
          className="form-input rounded-md py-1"
          name="username"
        ></input>
      </label>
      <label className="tracking-widest">
        <span className="px-2">密码</span>
        <input
          type="text"
          className="form-input rounded-md py-1"
          name="password"
        ></input>
      </label>
      <div className="flex gap-4">
        <button type="submit">提交</button>
        <button
          onClick={e => {
            e.preventDefault()
            set()
          }}
        >
          注册
        </button>
      </div>
    </Form>
  )
}

function EnrollForm({ set }) {
  return (
    <Form
      name="enroll"
      className="flex flex-col items-center gap-4 h-full justify-center relative z-20"
      method="post"
    >
      <input type="hidden" name="formType" value="form2" />
      <label className="tracking-widest">
        <span className="px-2">账户</span>
        <input
          type="text"
          className="form-input rounded-md py-1"
          name="username"
        ></input>
      </label>
      <label className="tracking-widest">
        <span className="px-2">密码</span>
        <input
          type="text"
          className="form-input rounded-md py-1"
          name="password"
        ></input>
      </label>
      <div className="flex gap-4">
        <button type="submit">提交</button>
        <button
          onClick={e => {
            e.preventDefault()
            set()
          }}
        >
          返回
        </button>
      </div>
    </Form>
  )
}

function IsFrom() {
  const [state, setState] = useState('login')
  function handelClick() {
    setState(state === 'login' ? 'enroll' : 'login')
  }
  return (
    <>
      {state === 'login' ? (
        <LoginForm set={handelClick} />
      ) : (
        <EnrollForm set={handelClick} />
      )}
    </>
  )
}

export default function Account() {
  const navigation = useNavigation()
  const actionData = useActionData() as ResponseMessage
  const navigate = useNavigate()
  const stateDispatch = (useContext(UserContext) as UserContextType).dispatch
  useEffect(() => {
    if (actionData) {
      console.log(actionData)
      const { code, msg = null, data = null } = actionData
      if (code === '500') {
        toast.error('服务器未响应')
      }
      if (code === '502' || code === '501') {
        console.log(msg)
        toast.error(data)
      }
      if (code === '201') {
        toast.success('登录成功')
        setTimeout(() => {
          localStorage.setItem('token', data as string)
          stateDispatch({ type: 'islogined' })
          navigate('/', { replace: true })
        }, 2000)
      }
    }
  }, [actionData, navigate, stateDispatch])
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        closeButton={false}
        transition={Slide}
        hideProgressBar={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        closeOnClick={true}
        newestOnTop={true}
        role="alert"
        theme="light"
      />
      <div className="flex justify-center items-center relative h-screen">
        <div className=" relative rounded-2xl z-20  border-2 lg:w-2/3 h-3/4 w-[25rem]">
          <div
            className={`z-10 w-full h-full absolute top-0 left-0 opacity-20 ${
              navigation.state === 'idle'
                ? `bg-[url('http://${IP}:5006/static/YanamiLogin.png')]`
                : `bg-[url('http://${IP}:5006/static/YanamiLoding.png')]`
            } rounded-2xl bg-cover bg-no-repeat`}
          ></div>
          <IsFrom />
        </div>
      </div>
    </>
  )
}

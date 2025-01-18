import React from 'react'
import { useEffect, useState } from 'react'
import { redirect } from 'react-router-dom'

const AudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioBase64, setAudioBase64] = useState(null) // base64的数据
  const [recording, setRecording] = useState(false) // 控制行为
  const [micState, setMicState] = useState(true) // 新增状态用于控制按钮文本
  const [mediaStream, setMediaStream] = useState(null) // 流存储
  const [shouldProcess, setShouldProcess] = useState(false) // 控制每次麦克风录入得到新的声音的情况
  const toggleRecording = () => {
    if (!recording) {
      handleStartRecording()
      // 切换recording状态
      setRecording(prevState => !prevState)
    } else {
      handleStopRecording()
    }
    setMicState(!micState) // 切换按钮文本
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMediaStream(stream) // 保存流到状态中
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
      recorder.start()
      recorder.onstop = event => {
        console.log('Recording stopped', event)
      }

      recorder.ondataavailable = event => {
        const audioBlob = event.data
        if (audioBlob.size > 0) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setAudioBase64(reader.result)
            setShouldProcess(true)
          }
          reader.readAsDataURL(audioBlob)
        }
      }
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop()
      setRecording(false)
      if (mediaStream) {
        // 释放媒体流
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }

  const handelButtonClick = async e => {
    if (e.target.value === '') return
    const params = { message: e.tatget.value }
    const queryString = new URLSearchParams(params).toString()
    redirect(`/components/effectFunction?${queryString}`)
  }

  useEffect(() => {
    if (shouldProcess && audioBase64 !== null) {
      fetch('http://192.168.1.21:5001/api/Vall/BaseModel', {
        method: 'POST',
        body: JSON.stringify({ base64: audioBase64 })
      })
      setShouldProcess(false)
    }
  }, [shouldProcess, audioBase64])
  return (
    <>
      {/* 网站的主页 */}
      <div className="flex flex-col w-full bg-gray-200 rounded-3xl relative">
        <p className="p-4 font-semibold text-[14px]">
          健康服务 <span className="text-[12px] text-gray-300">0.1</span>
        </p>
        <div className="flex flex-col items-center w-full h-72">
          123
          <p className="font-bold text-[18px]">你好, 我是健康助手</p>
          <p className="font-thin text-[12px]">一个简单的健康顾问</p>
          <div className="pt-6 flex flex-row justify-center w-full space-x-11">
            <div className="bg-white rounded-md w-44 h-44 space-y-2">
              <div className="flex flex-row p-2 items-center space-x-1">
                123
                <p>AI对话模板</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-md w-80 h-44 space-y-2">
              <p className="bg-white text-center rounded-xl h-8">AI游戏</p>
              <div className="flex flex-w-full space-x-11">
                <div
                  className="bg-white w-full rounded-md h-[130px] bg-cover"
                  onClick={() =>
                    fetch('http://192.168.1.21:5001/api/Vall/Game_FlyBird')
                      .then(res => res.json())
                      .catch(error => {
                        console.log(error)
                      })
                  }
                  style={{ backgroundImage: "url('/brid_fly.png')" }}
                >
                  <p className="text-[14px] text-center font-bold p-8">
                    小鸟健身
                  </p>
                </div>
                <a
                  href={'/components/VideoFrame'}
                  className="bg-white w-full rounded-md h-[130px] bg-cover"
                  style={{ backgroundImage: "url('/runi.png')" }}
                >
                  <p className="text-[14px] text-center font-bold p-2">
                    动作识别
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex absolute w-full bottom-10 justify-center">
          <div className="w-[95%] relative h-20">
            <input
              name="myInput"
              defaultValue={'可以提问任何有关健康方面的问题'}
              className="px-4 h-full w-full rounded-2xl"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault() // 阻止默认行为，如表单提交
                  handelButtonClick(e)
                }
              }}
            />
            <span className="w-14 h-14 bg-yellow-500 absolute right-4 top-2 px-3 py-1 rounded-2xl">
              {micState ? (
                <span onClick={toggleRecording}>123</span>
              ) : (
                <span onClick={toggleRecording}>123</span>
              )}
            </span>
            <span
              className="w-14 h-8 bg-yellow-600 absolute right-4 bottom-2 px-3 py-1 rounded-t-none rounded-2xl"
              onClick={handelButtonClick}
            >
              发送
            </span>
          </div>
        </div>
        {audioBase64 && <p>Audio Base64: {audioBase64}</p>}
      </div>
    </>
  )
}

export default AudioRecorder

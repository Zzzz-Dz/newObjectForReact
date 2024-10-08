import ip,{port} from '../data/localIp.js'
import { useEffect, useState } from 'react'
import { IconBallBowling,IconReload } from '@tabler/icons-react'

function PictrueMap(){
   const [pictrueDatas, setPictrueDatas] = useState(new Array(17))
   useEffect(() => {
      let ignore = false;
      async function startFetching() {
         try{
            const json = await fetch(`http://${ip}:${port}/getWorks`).then((res)=>res.json()).then((v)=>{const {worksData} = v; return worksData.map((data,index)=>{return {...data,id:index+1}})})
            if (!ignore) {
               setPictrueDatas(json);
            }
         }catch (e){
            return null
         }  
      }
      startFetching();
      return () => {
         ignore = true;
      };
   }
   ,[])
   return(
      <div className=' grid min-h-[40rem] grid-cols-4 xl1:grid-cols-5 content-evenly gap-x-5 gap-y-[1.5rem] relative mt-8 '>
         <IconReload className='absolute -right-8 top-1' size={30} color='black' />
         { pictrueDatas.map((data,index)=> {
            let id = data.id ?? index + 1
            let gridStyle = id === 1 ? { span:"row-span-2 col-span-2 h-[23rem] min-w-[500px] max-w-[580px] xl1:min-w-[490px]",imgStyle:" h-full ",absoluteText:"",information:"hidden" } : { span:"h-[13rem] w-[240px] lg2:w-full max-w-[280px] ",imgStyle:"h-[8.5rem]"};
            let gridMargin = 
               (id > 5 && id <= 7 && ' mt-[2.5rem] xl1:mt-0 ') ||
               (id >= 7 && id <= 9 && ' mt-[2.5rem] ') ||
               (id > 9 && (id < 13 ? ' mt-[1.5rem] xl1:mt-[2.5rem] ' : id === 13 ? ' mt-[1.5rem] ' : ' xl1:mt-[1.5rem]'));
            if (Object.keys(data).length === 0 ){
               return (
                  <div key={id} className={ gridStyle.span + gridMargin + ' border  rounded-md ' }>
                     <img alt={'Img Not found'} />
                  </div>)
            }
            const worksURL = data.pictrueURL.replace('&','/');
            const worksInformation = Object.values(data).slice(0,2).join('@') + '@' + Object.values(data).slice(2,-1).join('_')
            const FullURL = encodeURIComponent(worksURL + '/' + worksInformation);
            <div key={data.id} className={ gridStyle.span + gridMargin + ' '} >
               <img src={`http://${ip}:${port}/File/${FullURL}`} alt={`${data.pictrueName}`} className={ gridStyle.imgStyle + " w-full rounded-lg "}
                     style={{
                        backgroundSize: '100% 100%', // 强制背景图片填充整个元素
                        backgroundPosition: 'center', // 图片居中显示
                     }} />
               <h3 className={ gridStyle.absoluteText + " pr-7 h-[2.75rem] mt-[0.5rem] tracking-normal font-medium "} title="123">
                  <a href='/'>{data.worksName}</a>
               </h3>
               <div className={ gridStyle.information + " mt-[0.5rem] h-[1rem] " }>
                  <a href='/' className="flex items-end gap-1">
                     <IconBallBowling stroke={1} size={20} />
                     <p>{data.upName}</p>
                     <p>{data.uploadDate.split('.')[0]}</p>
                  </a>
               </div>
               {/* <div className='  w-full h-full absolute bg-gradient-to-t from-black from-0% to-100% '>1</div> */}
            </div>
            )})}
      </div>
      )
}

export default function HomePage(){
   return(
      <div className="grid grid-flow-col grid-cols-1">
         {/* Video Body */}
         <div className="main grid grid-flow-row bg-white place-self-start ml-5 lg1:ml-0 min-w-[1024px] max-w-[1024px] lg1:max-w-none lg1:place-self-center lg1:w-[89vw] lg2:min-w-[1000px] lg2:max-w-[1180px] xl1:max-w-none xl1:w-[90vw] 2xl:max-w-[83vw] ">
            <PictrueMap />
         </div>
      </div>
   )

}
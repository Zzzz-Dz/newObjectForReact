import { ReactReader } from "react-reader";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import IP from '../data/localIp.js'
export default function Readepub(){
    const id = useLoaderData();
    const [ book_title, suffix ] = id.split('.');
    return (
        <div className=" w-full h-full" >
           <Read key={id} EpubId={id} book_title={book_title} />
        </div>
        )
}

function Read({EpubId: id, book_title: title}){
    const [location, setLocation] = useState(0)
    return (
        <ReactReader
                title={`败犬女主太多了 ${title}`}
                url={`http://${IP}:5006/static/epub/${id} `}
                showToc={true}
                location={location}
                locationChanged={(epubcfi) => setLocation(epubcfi)}
                epubOptions={{
                    // flow: 'scrolled',  // 竖屏滑动
                    manager: 'continuous', // 填充模式
                  }}
            />
    )
}
"use client"

import { HashRouter as Router, Routes,Route,} from "react-router-dom" //此组件只有在client部分时才能使用
import { Path } from "../constant/constant"
import style from "./home.module.scss"
import Sidebar from "./sidebar"


export function Home() {
    return (
        <Router>
            {/* 样式借用 */}
            <div className={style.container}>
                
                    <Sidebar />
                <div className={style["window-content"]}>
                <Routes>
                    <Route path={Path.Mask}>mask</Route>
                    <Route path={Path.Chat}>chat</Route>
                    <Route path={Path.Home}>home</Route>
                </Routes>
                </div>
            </div>
        </Router>
    )
}
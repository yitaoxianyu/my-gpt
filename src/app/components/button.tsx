"use client"

import * as React from "react";

import style from "./button.module.scss"

export default function IconButton(props : {
        text ?: string,
        icon ?: JSX.Element,
        type ?: string,
        className ?: string,
        onClick : () => void,

    }
) 
{
    return (
        <button className= {style["icon-button"] + ` ${props.className ?? ""} clickable ${style[props.type ?? ""]}`}
            onClick={props.onClick}
        >
            {props.icon && (
            <div
              className={
                style["icon-button-icon"] +
                ` ${props.type === "primary" && "no-dark"}`
              }
            >
              {props.icon}
            </div>
          )}
    
          {props.text && (
            <div className={style["icon-button-text"]}>{props.text}</div>
          )}
        </button>
    )
}


'use client'

import Image from 'next/image'
import { TwoWorldsBoard, LocationType } from '@/components/two-worlds/board'
import React, {useState, useEffect} from 'react'


import {goForward, goBackward, setPlayerDisplayLocation, syncPlayerLocation} from  '@/redux/features/two-worlds';
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {range} from "lodash"

function delay<T>(value: T, ms: number) {
  return new Promise<T>(resolve => {
    setTimeout(() => {resolve(value)}, ms, )
  })
}

export default function Home() {
  /*
  function goForward() {
    
    const new_dummies = {
      players: dummies.players.map(({email,order,location,cash}) => ({email: email, order: order, location: (location+1)%54, cash: cash})),
      dummy_properties: Array.from(dummies.dummy_properties)
    }
    setDummies(new_dummies)
  }
  */

  const dispatch = useDispatch<AppDispatch>();
  const state = useAppSelector((state) => state.twoWorldsReducer);
  const [displayLocation0, setDisplayLocation0] = useState<number>(-1);
  const [displayLocation1, setDisplayLocation1] = useState<number>(-1);
  const [displayLocation2, setDisplayLocation2] = useState<number>(-1);
  const [displayLocation3, setDisplayLocation3] = useState<number>(-1);

  
  const players = state.players

  function GF(order: number) {
    return delay(order,600).then((value) => dispatch(goForward({order: value})))
  }

  function GB(order: number) {
    return delay(order,600).then((value) => dispatch(goBackward({order: value})))
  }

  function Warp(order: number, dest: number) {
    
  }

  

  const move =  (playerEmail: string, dest: number, type: "forward" | "backward" | "warp" = "forward") => {
    const {order, location} = state.players.filter(({email}) => email === playerEmail)[0];
    const promises = (() => {
      const _amount: number = (type === "forward") ? (
        (dest > location) ? (dest - location) : (54 - (location - dest))
      ) : (type === "backward") ? (
        (dest < location) ? (location - dest) : (54 - (dest - location))
      ) : 1;

      const _promises = range(0,_amount,1).map((item) => {
        return delay<number>(item, 600)
      })
      return _promises
    })()

    if(type === "forward") {
      return Promise.all(promises).then((values) => {
        values.forEach((_) => { dispatch(goForward({order})) })
      })
    } else if (type === "backward") {
      return Promise.all(promises).then((values) => {
        values.forEach((_) => { dispatch(goBackward({order})) })
      })
    } else {
      return Promise.all(promises).then((values) => {
        values.forEach((dest) => { dispatch(setPlayerDisplayLocation({order, dest})) })
      })
    }
  }

  function MA(playerEmail: string) {
    const {location} = state.players.filter(({email}) => email === playerEmail)[0]
    return move(playerEmail,location + 5,"forward")
  }

  return (
    <div>
      <div>
        <TwoWorldsBoard
          width={960} />
      </div>
        
      <div>
        {Array.from(players).map((player) => {
          return {
            element: (
              <div key={"bgroupId{players.order}"}>
                <button onClick={async (e) => {
                  await GF(player.order)
                  dispatch(syncPlayerLocation())
                }}>
                  {"  -- Move Player {players.order} one step --  "}
                </button>
                <button onClick={async (e) => {
                  await MA(player.email)
                  dispatch(syncPlayerLocation())
                }}>
                  {"  -- Move Player {players.order} five steps --  "}
                </button>
              </div>
            ),
            order: player.order
          }
        }).sort((a,b) => a.order - b.order).map(({element}) => element)}
      </div>

      <div>

      </div>
        
    </div>
  )
}

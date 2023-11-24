import { createSlice, PayloadAction, compose } from "@reduxjs/toolkit";
import {range} from "lodash"

type PlayerType = {
    email: string,
    order: number,
    location: number,
    displayLocation: number,
    cash: number
}

type PropertyType = {
    ownerEmail: string,
    count: number,
    cellId: number
}

type GoPayload = {
    order: number
}

type SetPlayerLocationPayload = {
    order: number,
    dest: number
}

type LocationType = number | null

type StateType = {
    players: PlayerType[],
    properties?: PropertyType[],
    dummy_properties: PropertyType[]
}

const initialState: StateType = {
    players: [
        {
            email: "yeun0908@gmail.com",
            order: 0,
            location: 0,
            displayLocation: 0,
            cash: 4000000
        },
        {
            email: "newsniper@protonmail.com",
            order: 1,
            location: 0,
            displayLocation: 0,
            cash: 4000000
        },
        {
            email: "by_yeun@daum.net",
            order: 2,
            location: 0,
            displayLocation: 0,
            cash: 4000000
        },
        {
            email: "by_yeun@korea.ac.kr",
            order: 3,
            location: 0,
            displayLocation: 0,
            cash: 4000000
        }
    ],
    dummy_properties: [
        {
            ownerEmail: "by_yeun@daum.net",
            count: 3,
            cellId: 2
        },
        {
            ownerEmail: "newsniper@protonmail.com",
            count: 2,
            cellId: 4
        }
    ]
}

compose()


export const twoWorldsDummySlice = createSlice({
    name: "two-worlds",
    initialState,
    reducers: {
        goForward: (state, action: PayloadAction<GoPayload>) => {
            for(let player of state.players) {
                if(player.order === action.payload.order) {
                    player.displayLocation = (player.displayLocation+1) % 54
                }
            }
        },
        goBackward: (state, action: PayloadAction<GoPayload>) => {
            for(let player of state.players) {
                if(player.order === action.payload.order) {
                    player.displayLocation = (player.displayLocation-1) % 54
                }
            }
        },
        setPlayerDisplayLocation: (state, action: PayloadAction<SetPlayerLocationPayload>) => {
            for(let player of state.players) {
                if(player.order === action.payload.order) {
                    player.displayLocation = action.payload.dest
                }
            }
        },
        syncPlayerLocation: (state) => {
            for(let player of state.players) {
                player.location = player.displayLocation
            }
        }
    }
});

export const {
    goForward, goBackward, syncPlayerLocation, setPlayerDisplayLocation
} = twoWorldsDummySlice.actions;

export default twoWorldsDummySlice.reducer;
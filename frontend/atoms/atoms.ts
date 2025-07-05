import { atom } from "recoil"

export const usernameAtom = atom<string|null>({
    key: "usernameAtom",
    default: ""
})

export const roomAtom = atom<string|null>({
    key: "roomAtom",
    default: ""
})
interface Message {
    userName: string,
    roomID: string,
    alert: boolean,
    text: string,
    date: string
}
export const messageAtom = atom<Message[]|null>({
    key: "messageAtom",
    default: []
})
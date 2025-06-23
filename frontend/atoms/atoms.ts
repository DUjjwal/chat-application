import { atom } from "recoil"

export const usernameAtom = atom<string>({
    key: "usernameAtom",
    default: ""
})

export const roomAtom = atom<string>({
    key: "roomAtom",
    default: ""
})
interface Message {
    userName: string,
    roomID: string,
    alert: boolean,
    text: string
}
export const messageAtom = atom<Message[]>({
    key: "messageAtom",
    default: []
})
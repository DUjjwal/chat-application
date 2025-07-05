import type { ChangeEvent, KeyboardEvent } from "react"

function InputBox(obj: {
    title: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    onKeyDown: (e:KeyboardEvent<HTMLInputElement>) => void
}) {
    return(
        <div className="text-lg my-4 w-[100%] md:text-xl xl:text-2xl">
            <input type="text" name="" placeholder={obj.title} className="text-center outline w-full rounded-lg p-2 w-[100%] outline-2 outline-gray-200 focus:outline-gray-500 focus:shadow-sm" onChange={obj.onChange} onKeyDown={obj.onKeyDown}/>
        </div>
    )
}
export default InputBox
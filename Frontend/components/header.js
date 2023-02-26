import HeaderIcon from "./headerIcon"
import Image from "next/image"
import { HiHome } from "react-icons/fa"

export default function Header() {
    return (
        <div>
            <h1> Header</h1>

            {/*TODO: Add LOGO Left side*/}
            <div></div>

            {/* Center */}
            <div className="flex-justify-center flex-grow">
                <div className="flex space-x-6 md:space-x-2">
                    <HeaderIcon active Icon={HiHome}/>


                </div>
            </div>

            {/* Right */}
            <div className="flex items-center sm:space-x-2 justify-end">
                <p className="whitespace-nowrap font-semibold pr-3">Lingjet</p>
            </div>
        </div>
    );
}
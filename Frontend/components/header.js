import HeaderIcon from "./headerIcon"

function Header() {
    return (
        <div>
            <h1> Header</h1>

            {/*TODO: Add LOGO Left side*/}
            <div>
                <Image
                    src=""
                    width={40}
                    height={40}
                    layout="fixed"
                />
            </div>

            {/* Center */}
            <div className="flex-justify-center flex-grow">
                <div className="flex space-x-6 md:space-x-2">
                    <HeaderIcon Icon={HomeIcon}/>
                    <HeaderIcon Icon={UserGroupIcon}/>
                    <HeaderIcon Icon={SettingsIcon}/>

                </div>
            </div>

        </div>
    )
}

export default Header
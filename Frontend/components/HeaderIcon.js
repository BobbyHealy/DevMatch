import Head from "next/head";

function HeaderIcon( {Icon} ) {
    return (
        <div className='cursor-pointer'>
            <Icon className="h-5"/>
        </div>
    );
}

export default HeaderIcon;
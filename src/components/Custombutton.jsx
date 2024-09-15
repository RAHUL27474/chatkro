import React from 'react'

const Custombutton = ({text,fun,styles}) => {
    console.log("custon button reacthed")
  return (
    <button onClick={fun} className={`${styles}  rounded-md tracking-normal text-lg  border-black p-2  outline-black`}>
        {" "}{text}{" "}
    </button>
  )
}

export default Custombutton
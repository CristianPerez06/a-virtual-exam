import React from 'react'
import { Header } from '.'

const LayoutAuth = (props) => {
  return (
    <div id='layout-auth' className='h-100 w-100'>
      <Header />
      <div id='body' className='d-flex justify-content-center mt-4'>
        <div className='container' style={{ width: 850 + 'px' }}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default LayoutAuth

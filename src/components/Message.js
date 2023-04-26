import React, { useState } from 'react'

const Message = (props) => {
  const [to, setTo] =  React.useState('');
  const [msg, setMsg] = React.useState('');
  const [smsLogs, setSmsLogs] = React.useState([]);

  const addSmsLog = (smsLog) => {
      setSmsLogs(prevSmsLogs => [...prevSmsLogs, smsLog]);
  }
  const sendMessage = async (e) => <a href={props.location.mapURL}>(Map)</a> ;
  return (
    
      <div className='message'>
      
          <h3>Enter Reciepient's Phone Number</h3>
          <form onSubmit={sendMessage}>
            <div className='send_to'>
               <label>Send To</label>
                <input  value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <div className='test_area'>
              <label>Message</label>
                <textarea value={msg} onChange={e =>setMsg(e.target.value)}></textarea>
            </div>
               {/*  <span/> */}
               <div className='send_sms'>
               <button className='btn bg bg-success'>Send SMS</button>
               </div>
               
            </form>

        </div>
         
    
  )
}

export default Message

import './App.css';
import React, {useState, useEffect, useRef} from 'react';



function App() {
  const [breakLen, setBreakLen] = useState(5)
  const [sessionLen, setSessionLen] = useState(25)
  const isBreak = useRef(false)
  const [munite, setMunite] = useState(25)
  const [second, setSecond] = useState(0)
  const passedSecond = useRef(0)
  const passedmunite = useRef(25)
  const intervalRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false)

  const [sessionMsg, setSessionMsg] = useState("Session")

  const audioRef = useRef(null)

  

  
  useEffect(()=>{
    if(!isBreak.current){
      setMunite(sessionLen)
      passedSecond.current = 0
      setSecond(0)
    }
  },[sessionLen])
  
  useEffect(()=>{
    if(isBreak.current){
      setMunite(breakLen)
      passedSecond.current = 0
      setSecond(0)
    }
  },[breakLen])

  useEffect(()=>{
    passedmunite.current = munite
  },[munite])

  const reset = () =>{
    // Stop any running time and reset time
    pause()
    setBreakLen(5)
    setSessionLen(25)
    setSecond(0)
    passedSecond.current = 0
    isBreak.current = false
    setMunite(25)
    setSecond(0)
    passedmunite.current = 25
    audioRef.current.pause();
  }
  const incBreak = ()=>{
    if(breakLen < 60 && !hasStarted){
      setBreakLen(breakLen + 1)
    }
  }
  const decBreak = ()=>{
    if(breakLen > 1 && !hasStarted){
      setBreakLen(breakLen - 1)
    }
  }
  const sessionDec = ()=>{
    if(sessionLen > 1 && !hasStarted){
      setSessionLen(sessionLen - 1)
    }
  }
  const sessionInc = ()=>{
    if(sessionLen < 60 && !hasStarted){
      setSessionLen(sessionLen + 1)
    }
    
  }

  const pause = () =>{
    clearInterval(intervalRef.current)
    setHasStarted(false)
  }
  
  const start =()=>{
    setHasStarted(true)
    intervalRef.current = setInterval(() => {
      if(passedSecond.current === 0){
        if(passedmunite.current === 0){
          // Beap sound should start
          audioRef.current.currentTime = 0; // Reset to the beginning
          audioRef.current.play(); // Start playing
          // Break should begin counting
          isBreak.current = !isBreak.current

          if(isBreak.current){
            // Set the munite and sec to munite break
            setSessionMsg("Break")
            setMunite(breakLen)
            setSecond(0)
            passedmunite.current = breakLen
          }else{
            // Set the munite and sec to munite session
            setSessionMsg("Session")
            setMunite(sessionLen)
            setSecond(0)
            passedmunite.current = sessionLen
          }


        }else{
          setMunite(prev => prev - 1)
          setSecond(59)
          passedSecond.current = 59
          
        }
        
      }else{
          passedSecond.current = passedSecond.current -1
          setSecond((prev) => prev - 1)
        
      }
      
    }, 1000);
  }
  
  
  

  return (
    <div className='timer'>
      <h2>25 + 5 Clock</h2>
      <div className='label-container'>
        <div>
          <label id="break-label">Break Length</label><br/> <br/>
          <button id="break-increment" onClick={incBreak}>&#8593;</button>
          <span id="break-length">{breakLen}</span>
          <button id="break-decrement" onClick={decBreak}>&darr;</button>
        </div>
        <div>
          <label id="session-label">Session Length</label> <br/> <br/>
          <button id="session-increment" onClick={sessionInc}>&#8593;</button>
          <span id="session-length">{sessionLen}</span>
          <button id="session-decrement" onClick={sessionDec}>&darr;</button>
        </div>

      </div>
      
      

      <div className='session-container'>
        <label id="timer-label">{sessionMsg}</label>
        <div id="time-left">{munite > 9 ? munite : "0"+munite}:{second > 9 ? second : "0" + second}</div>
        <button id="start_stop" onClick={hasStarted ? pause : start}>&#9208;</button>
        <button id="reset" onClick={reset}>&#128260;</button>

        <audio ref={audioRef} src="beep.mp3" />

      </div>
      
    </div>
    
  );
}

export default App;

// Working on incrementation, update session if is session on and vice versa

import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import PostData from './util/PostData';

interface Board {
  id: number;
  name : string;
}

const App:React.FC = () => {
  const [name,setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [boardContent,setBoardContent] = useState<Board[]>([]);
  const [modal,setModal] = useState(false);
  const [update,setUpdate] = useState(false);
  const [updateName,setUpdateName] = useState('');
  const [updateKey,setupdateKey] = useState(0);
  const [id,setId] = useState<string>('');
  const [loginSuccess,setLoginSuccess] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const pwdRef = useRef<HTMLInputElement | null>(null);

  const signUpId = useRef<HTMLInputElement | null>(null);
  const signUpPwd = useRef<HTMLInputElement | null>(null);
  const signUpPwdChk = useRef<HTMLInputElement | null>(null);
  const signUpName = useRef<HTMLInputElement | null>(null);
  const signUpEmail = useRef<HTMLInputElement | null>(null);
  /*
    타입스크립트 같은경우 ref값이 명시적 타입이 지정되어있지 않으면 undefiend로 인식
    제너릭을 이용하여 ref값을 null또는 요소값으로 적용 초기값은 null를 적용하여
    오류가 안나오게 설정
  */
  const inputValue = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const fetchInedx = async () => {
      try {
        const response = await fetch('/index');
        
        if(!response.ok){
          throw new Error('Network response was not ok');
        }
        let data = await response.json()

        if(data.user !== null) {
          console.log(data)
          setBoardContent(data.board);
          setLoginSuccess(true);
          setName(data.user.user_name)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
    fetchInedx()
  },[])

  if (loading) {
    console.log('로딩중...')
    return (<div>Loading ...</div>)
  }
const openModal = () =>{
  setModal(true);
}

const postData = () => {
  //inputValue가 존재할때
  if (inputValue.current){
    let value: string = inputValue.current.value;
    let newId: number;
    //value값(input)이 빈칸이면 경고창 뜨게
    if(value===''){
      alert('값을 입력하세요')
    }else {
      //array가 비어있는지 아닌지 파악
      if(Array.isArray(boardContent) && boardContent.length === 0) {
            //비어있으면 id값을 1번부터 시작하게해서 생성
            newId=1;
            console.log(newId,value)
            setModal(false);
            //추가하기를 누르면 화면에 바로 생성하게
            boardContent.push({id:newId,name:value})
            //데이터를 보내 실제 서버에 있는 배열데이터에 추가하게 실행
            fetch('/insert' //주소를 보내 뒤의 insert를 확인하여 해당 펑션 실행
              ,{
              method:'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id : newId,
                name : value
              }),
          
            }).then((response) => response.json())
            .then((result) => console.log(result))
      }
      else {
        boardContent.forEach((item,index) => {
          if(index === boardContent.length-1){
            newId = item.id+1
            console.log(newId,value)
            setModal(false);
            boardContent.push({id:newId,name:value})
            fetch('/insert',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id : newId,
                name : value
              }),
          
            }).then((response) => response.json())
            .then((result) => console.log(result))
          }
        })
      }

    }
  } 

}

const deleteData = (deleteKey:number) => {
  // 클릭한 아이템을 제외한 새로운 배열 생성
  // filter는 배열을 읽은뒤 뒤에 조건문과 맞는 것만 남기고 새로운 배열을 생성
  const updatedContent = boardContent.filter((board) => board.id !== deleteKey);
  setBoardContent(updatedContent); // 상태 업데이트

  fetch('/delete',{
    method:'DELETE',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      id: deleteKey
    })
  })
}

const updateClick = (id:number,name:string) => {
  setUpdate(true)
  let indexNum = boardContent.findIndex((board) => board.name === name)
   setUpdateName(boardContent[indexNum].name)
   setupdateKey(boardContent[indexNum].id)
}
/** 업데이트 값을 변경하기위한 메소드 */
const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   /** 상태를 업데이트 */ 
  setUpdateName(e.target.value);
};

const updateData = (id:number) => {
  /** 타입스크립트에서는 null타입은 특정타입에 들어갈 수 x 그래서 조건문으로 null 먼저 체크 */ 
  if(inputValue.current){
    let updateValue:string = inputValue.current.value;
    console.log(updateValue)
    if(updateValue===''){
      //빈칸이 들어올 때 경고창 뜨게
      alert('변경할 내용을 적어주세요!')
    }
    else {
      /*
        값이 확인되면 새로운 게시판 콘텐츠 배열 생성하기 위해
        map을 이용하여 기존값과 보내준 id값을 확인
      */
      const updateBoradContent = boardContent.map((board) => {
        if(board.id === id) {
          return{...board, name:updateValue};
        }
        return board;
      })
      setBoardContent(updateBoradContent)
      setUpdate(false)
      //fetch 기능을 이용해 update연결
      fetch('/update',{
        method:'PUT', // update는 put메소드 사용 (대문자)
        headers : {
          'Content-Type' : 'application/json'
        }, body : JSON.stringify({
          id: id,
          name: updateValue
        })
      })
    }
  }
}
function login( id : string ) {
  const pwd = pwdRef.current ? pwdRef.current.value : '';
  fetch('/login',{
    method:"POST",
    headers: {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      user_id : id,
      user_pwd : pwd,
    })
  }).then(response => response.json())
  .then(data => {
    console.log(data)
    if(data.item){
      setBoardContent(data.board);
      setName(data.item.user_name)
      setId('');
      setLoginSuccess(true);
      if(pwdRef.current) pwdRef.current.value = '';
    } else {
      alert(data.message)
      setId('');
      if(pwdRef.current) pwdRef.current.value = '';
    }

  })
  .catch(error => console.error(error));
}

const logout = () => {
  fetch('logout')
  .then(response => response.json())
  .then(data => {
    alert(data.message)
    setLoginSuccess(false);
  })
  .catch(error => console.error(error));
}

const signupModalOn = () => {
  setSignUpModal(true);
}

const signUp = () => {
  let id = signUpId.current ? signUpId.current.value : '';
  let pwd = signUpPwd.current ? signUpPwd.current.value : '';
  let name = signUpName.current ? signUpName.current.value : '';
  let email = signUpEmail.current ? signUpEmail.current.value : '';

  fetch('/signup', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      user_id: id,
      user_pwd: pwd,
      user_name: name,
      user_email: email,
    })
  }).then(response => response.json())
  .then(data => {
    alert(data.message);
    if(signUpId.current) signUpId.current.value = '';
    if(signUpPwd.current) signUpPwd.current.value = '';
    if(signUpName.current) signUpName.current.value = '';
    if(signUpEmail.current) signUpEmail.current.value = '';
    setSignUpModal(false);
  }).catch(
    error => console.error(error)
  )
}
  return (
    <div className="App">
        <div>
           {!loginSuccess && <div>
              <div>
                <p>아이디</p>
                <input type='text' id='id' value={id} onChange={e => setId(e.target.value)}></input>
              </div>
              <div>
                <p>비밀번호</p>
                <input type='password' id='pwd' ref={pwdRef}></input>
              </div>
              <div>
                <button onClick={()=> {login(id)}}>로그인 하기</button>
                <button onClick={signupModalOn}>회원가입</button>
              </div>
            </div>
          }
          {
            signUpModal && <div className='modal'>
              <div className='modalBox'>
              <div>
                    아이디 : <input type="text" name="" id="singup-id" ref={signUpId} />
                  </div>
                  <div>
                    비밀번호 : <input type="password" ref={signUpPwd} />
                  </div>
                  <div>
                    비밀번호 확인 : <input type="password" ref={signUpPwdChk}/>
                  </div>
                  <div>
                    이름 : <input type="text" name="" id="signup-name" ref={signUpName}/>
                  </div>
                  <div >
                      EMail : <input type="text" name="" id="signup-email" ref={signUpEmail}/>@ <input type="text" name="" id="" />
                  </div>
                  <div>
                    <button onClick={signUp}>회원가입하기</button>
                  </div>
              </div>
            </div>
          }
          {loginSuccess && <div>
              환영합니다 {name}님!
              <div><button onClick={logout}>로그아웃</button></div>
              <div>
              <table>
                <thead>
                  <tr>
                      <th>번호</th>
                      <th>제목</th>
                      <th>기능</th>
                  </tr>
                </thead>
                <tbody>
                  {boardContent.map((board) => (
                      <tr key={board.id}>
                      <td>{board.id}</td>
                      <td>{board.name}</td>
                      <td><button onClick={() => deleteData(board.id)}>삭제</button></td>
                      <td><button onClick={() => updateClick(board.id,board.name)}>변경</button></td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>
                    <PostData openModal={openModal}/>
                  </td>
                </tr>
              </tfoot>
            </table>
            </div>
            {modal &&
            <div>
              <input type='text' placeholder='추가할 값을 입력하세요' ref={inputValue}/>
              <button onClick={postData}>보내기</button><button onClick={() => setModal(false)}>취소하기</button>
            </div>}
            {update &&
              <div>
                <input type='text' value={updateName} key={updateKey} ref={inputValue}  onChange={handleUpdateChange} />
                <button onClick={() => updateData(updateKey)}>변경하기</button>
              </div>
            }
            </div>}

        </div>
    </div>
  );
}

export default App;

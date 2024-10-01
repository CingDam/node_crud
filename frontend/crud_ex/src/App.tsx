import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import PostData from './util/PostData';
import Modal from './Modal/PostData';

interface Board {
  id: number;
  name : string;
}

const App:React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [boardContent,setBoardContent] = useState<Board[]>([]);
  const [modal,setModal] = useState(false);
  const [update,setUpdate] = useState(false);
  const [updateName,setUpdateName] = useState('');
  const [updateKey,setupdateKey] = useState(0);
  /*
    타입스크립트 같은경우 ref값이 명시적 타입이 지정되어있지 않으면 undefiend로 인식
    제너릭을 이용하여 ref값을 null또는 요소값으로 적용 초기값은 null를 적용하여
    오류가 안나오게 설정
  */
  const inputValue = useRef<HTMLInputElement | null>(null);
  let data;
  
  useEffect(() => {
    const fetchInedx = async () => {
      try {
        const response = await fetch('http://localhost:3001/');
        
        if(!response.ok){
          throw new Error('Network response was not ok');
        }
        data = await response.json()
        console.log(data)
        setBoardContent(data);
        console.log(data)
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
            fetch('http://localhost:3001/insert' //주소를 보내 뒤의 insert를 확인하여 해당 펑션 실행
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
            fetch('http://localhost:3001/insert',{
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

  fetch('http://localhost:3001/delete',{
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

const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUpdateName(e.target.value); // 상태를 업데이트
};

const updateData = (id:number) => {
  if(inputValue.current){
    let updateValue:string = inputValue.current.value;
    console.log(updateValue)
    if(updateValue===''){
      alert('변경할 내용을 적어주세요!')
    }
    else {
      const updateBoradContent = boardContent.map((board) => {
        if(board.id === id) {
          return{...board, name:updateValue};
        }
        return board;
      })
      setBoardContent(updateBoradContent)
      fetch('http://localhost:3001/update',{
        method:'PUT',
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

  return (
    <div className="App">
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
            {modal &&
            <div>
              <input type='text' placeholder='추가할 값을 입력하세요' ref={inputValue}/>
              <button onClick={postData}>보내기</button><button onClick={() => setModal(false)}>취소하기</button>
            </div>}
            {
              update &&
              <div>
                <input type='text' value={updateName} key={updateKey} ref={inputValue}  onChange={handleUpdateChange} />
                <button onClick={() => updateData(updateKey)}>변경하기</button>
              </div>
            }
        </div>
    </div>
  );
}

export default App;

import { useState } from "react";

interface PostDataProps {
    openModal : () => void;
}

const PostData: React.FC<PostDataProps>= ({ openModal }) => {



    return(
        <div>
            <button onClick={openModal}>추가하기</button>
        </div>
    )
}

export default PostData;
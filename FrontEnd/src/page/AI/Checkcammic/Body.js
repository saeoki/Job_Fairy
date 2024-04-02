// import React, { useState } from 'react';
// import axios from 'axios';

// function Body() {
//     const [status, setStatus] = useState('');
//     const [message, setMessage] = useState('');

//     const handleCheckButtonClick = () => {
//         setStatus('checking');
//         setMessage('카메라 및 마이크 점검 중...');

//         axios.get('http://localhost:5000/check_cam_mic')
//             .then(response => {
//                 setStatus('success');
//                 setMessage('카메라 및 마이크가 정상적으로 작동합니다.');
//             })
//             .catch(error => {
//                 setStatus('error');
//                 setMessage('카메라 또는 마이크에 문제가 발생했습니다.');
//                 console.error('Error occurred:', error);
//             });
//     };

//     let statusColor;
//     switch (status) {
//         case 'checking':
//             statusColor = 'orange';
//             break;
//         case 'success':
//             statusColor = 'green';
//             break;
//         case 'error':
//             statusColor = 'red';
//             break;
//         default:
//             statusColor = 'black';
//     }

//     return (
//         <div className="body">
//             <h1>카메라 및 마이크 점검</h1>
//             <button onClick={handleCheckButtonClick}>점검 시작</button>
//             <p style={{ color: statusColor }}>{message}</p>
//         </div>
//     );
// }

// export default Body;

























// // import React, { useState } from 'react';
// // import axios from 'axios';

// // function Body() {
// //     const [status, setStatus] = useState('');
// //     const [message, setMessage] = useState('');

// //     const handleCheckButtonClick = () => {
// //         setStatus('checking');
// //         setMessage('카메라 및 마이크 점검 중...');

// //         axios.get('http://localhost:5000/check_cam_mic')
// //             .then(response => {
// //                 setStatus('success');
// //                 setMessage('카메라 및 마이크가 정상적으로 작동합니다.');
// //             })
// //             .catch(error => {
// //                 setStatus('error');
// //                 setMessage('카메라 또는 마이크에 문제가 발생했습니다.');
// //                 console.error('Error occurred:', error);
// //             });
// //     };

// //     let statusColor;
// //     switch (status) {
// //         case 'checking':
// //             statusColor = 'orange';
// //             break;
// //         case 'success':
// //             statusColor = 'green';
// //             break;
// //         case 'error':
// //             statusColor = 'red';
// //             break;
// //         default:
// //             statusColor = 'black';
// //     }

// //     return (
// //         <div className="body">
// //             <h1>카메라 및 마이크 점검</h1>
// //             <button onClick={handleCheckButtonClick}>점검 시작</button>
// //             <p style={{ color: statusColor }}>{message}</p>
// //         </div>
// //     );
// // }

// // export default Body;

import React from 'react';
import CameraMicAccess from './CameraMicAccess'; 
import "../css/Body.css"

function Body(){
    return(
        <div className="body">
            <div id = "checkcammic-box">
                <CameraMicAccess /> 
            </div>
        </div>
    )
}

export default Body;

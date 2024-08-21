// src/components/ToastMessage.js
import Swal from 'sweetalert2';


export const LoginToast = () => {
    Swal.fire({
        icon: 'success',
        title: '로그인 성공!',
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true
    });
};

export const LogoutToast = () => {
    Swal.fire({
        icon: 'success',
        title: '로그아웃 성공!',
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true
    });
};

export const ErrorToast = (errorCode) => {
    Swal.fire({
        icon: 'error',
        title: `에러가 발생했습니다.\n에러코드 : ${errorCode}\n관리자에게 문의하세요.`,
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
};

export const LoginErrorToast = () => {
    Swal.fire({
        icon: 'error',
        title: `로그인 후 이용가능합니다.`,
        // toast: true,
        position: 'center-center',
        showConfirmButton: true, // Show the confirm button
        confirmButtonText: '확인', // Customize the confirm button text
        preConfirm: () => {
            window.location.href = '/'; // Replace with your desired URL
        }
    });
};
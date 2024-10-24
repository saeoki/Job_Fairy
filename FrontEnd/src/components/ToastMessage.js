// src/components/ToastMessage.js
import Swal from 'sweetalert2';


export const LoginToast = () => {
    Swal.fire({
        icon: 'success',
        title: '로그인 성공!',
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 500,
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

export const RegisterToast = () => {
    Swal.fire({
        icon: 'info',
        title: '추가정보를 등록해야됩니다.!',
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true

    });
};

export const RegisterSuccessToast = () => {
    Swal.fire({
        icon: 'success',
        title: '추가정보 등록완료!',
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
};

export const ModifySuccessToast = () => {
    Swal.fire({
        icon: 'success',
        title: '내 정보 수정완료!',
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
};

export const SaveSuccessToast = () => {
    Swal.fire({
        icon: 'success',
        title: '저장 완료!',
        text: "리포트페이지에서 확인하실 수 있습니다.",
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true
    });
};

export const RemoveJasoseReportToast = () => {
    Swal.fire({
        icon: 'success',
        title: '삭제 완료!',
        text: "정상적으로 삭제되었습니다.",
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true
    });
}
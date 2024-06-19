import "../../Home/css/Footer.css"

function Footer(){
    return(
      <footer className="footer">
        <div className="inner">
          <div className="footer-message">컴퓨터공학과 SS트랙 졸업작품 & 캡스톤디자인 출품작<br />작품명 : 취업의 요정</div>
          <div className="footer-contact">개발자: 김범수, 이상억, 정세욱
            <br />
            <nav>
            소스코드 저장소 : &nbsp;
              <a href='https://github.com/saeoki/Job_Fairy' target='_blank'>Github</a>
            </nav>
          </div>
          <div className="footer-copyright">Copyrigh 2024 All ⓒ rights reserved</div>
        </div>
      </footer>
    )
}

export default Footer
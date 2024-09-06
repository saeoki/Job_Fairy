import React from 'react';
import Slider from 'react-slick';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

const Carousel = () => {
  // 각 화면 크기별 이미지 URL
  const images = {
    xs: ['./images/banner_codingtest_xs.png', './images/banner_ITAP_xs.png'],
    sm: ['./images/banner_codingtest_sm.png', './images/banner_ITAP_sm.png'],
    md: ['./images/banner_codingtest_md.png', './images/banner_ITAP_md.png'],
    lg: ['./images/banner_codingtest_lg.png', './images/banner_ITAP_lg.png']
  };

  // 화면 크기별 미디어 쿼리
  const isXS = useMediaQuery({ query: '(max-width: 575px)' });
  const isSM = useMediaQuery({ query: '(min-width: 576px) and (max-width: 767px)' });
  const isMD = useMediaQuery({ query: '(min-width: 768px) and (max-width: 991px)' });
  const isLG = useMediaQuery({ query: '(min-width: 992px)' });

  // 현재 화면 크기에 맞는 이미지 배열 선택
  const currentImages = isXS ? images.xs : isSM ? images.sm : isMD ? images.md : images.lg;

  // Slick Carousel 설정
  const settings = {
    // dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    // arrows: true
    autoplay: true,  // 자동 전환 활성화
    autoplaySpeed: 3000,  // 3초마다 자동 전환
  };

  return (
    <Slider {...settings}>
      {currentImages.map((image, index) => (
        <div key={index}>
          <Link to={index===0 ? "/CodingTest":"/ITAP"}>
            <img src={image} alt={`Slide ${index}`} style={{ width: '100%', height: 'auto' }} />
          </Link>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;

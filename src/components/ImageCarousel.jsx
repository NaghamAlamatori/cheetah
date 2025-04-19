import React from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageCarousel() {
  const { t } = useTranslation();
  
  const carouselImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80",
      title: t('carousel.luxury.title'),
      description: t('carousel.luxury.description')
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80",
      title: t('carousel.sports.title'),
      description: t('carousel.sports.description')
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80",
      title: t('carousel.classic.title'),
      description: t('carousel.classic.description')
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <div className="w-full h-[600px] mb-8 relative overflow-hidden rounded-xl">
      <Slider {...settings}>
        {carouselImages.map((image) => (
          <div key={image.id} className="relative h-[600px] overflow-hidden">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 bg-black bg-opacity-50 text-white p-6 rounded-lg">
              <h3 className="text-3xl font-bold">{image.title}</h3>
              <p className="text-xl">{image.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ImageCarousel;
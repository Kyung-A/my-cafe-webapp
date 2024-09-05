/* eslint-disable @typescript-eslint/no-explicit-any */
import Slider from "react-slick";

interface IImageSlider {
  data: string[];
  onClick?: (e: any) => void;
}

export function ImageSlider({ data, onClick }: IImageSlider) {
  const sliderInit = {
    dots: false,
    Infinity: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="slider-container max-h-[208px] overflow-hidden">
      <Slider {...sliderInit}>
        {data.map((src) => (
          <div key={src} className="h-full w-full">
            <input
              src={src}
              type="image"
              onClick={onClick}
              className="top-1/4 aspect-square w-full -translate-y-1/4 object-cover"
              alt="이미지"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

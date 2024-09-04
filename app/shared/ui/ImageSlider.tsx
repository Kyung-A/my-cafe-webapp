import Slider from "react-slick";

interface IImageSlider {
  data: string[];
}

export function ImageSlider({ data }: IImageSlider) {
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
            <img
              src={src}
              className="top-1/4 aspect-square w-full -translate-y-1/4 object-cover"
              alt="이미지"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

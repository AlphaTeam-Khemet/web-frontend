import { heroSlides } from '../../data/homeData';
import useFadeGallery from '../../hooks/useFadeGallery';

export default function FadeGallery() {
  const { currentIndex, setIsPaused, nextSlide, goToSlide } =
    useFadeGallery(heroSlides, 5000);

  return (
    <div
      className="home-gallery"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={nextSlide}
    >
      {heroSlides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.image}
          alt="Khemet museum"
          className={`home-gallery-img ${
            index === currentIndex ? 'active' : ''
          }`}
        />
      ))}

      <div className="home-gallery-overlay" />

      <div className="home-gallery-dots">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === currentIndex ? 'active' : ''}
            onClick={(event) => {
              event.stopPropagation();
              goToSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
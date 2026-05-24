import { useEffect, useState } from 'react';

export default function useFadeGallery(slides, delay = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, delay);

    return () => clearInterval(timer);
  }, [delay, isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return {
    currentIndex,
    setIsPaused,
    nextSlide,
    goToSlide,
  };
}
import React, { useState, useEffect, useRef } from "react";
import { getQueryData } from "../services/page.service";
import Loader from "./Loader";

export interface Slide {
    image: string;
    description: string;
    button?: {
        text: string;
        link: string;
    };
}

const CarouselWrapper = ({ query_id }: { query_id: string }) => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [rotationTime, setRotationTime] = useState(3);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getQueryData("f6e1a0ba-d1f5-4682-a9fe-689aacf49f01", { carouselid: "home-slider" })
            .then((res) => {
                const data = (res as any)?.data?.[0];
                if (!data) return;

                setRotationTime(data.carousels_rotation_time || 3);

                const formattedSlides: Slide[] = data.carousel_content.map(
                    (item: any) => ({
                        image: item.carousel_items_image,
                        description: item.carousel_items_oltext || "",
                        button: item.carousel_items_button_text
                            ? {
                                text: item.carousel_items_button_text,
                                link: item.carousel_items_uri,
                            }
                            : undefined,
                    })
                );

                setSlides(formattedSlides);
            })
            .catch((err) =>
                console.error("Carousel Data fetch failed:", err)
            )
            .finally(() => setLoading(false));
    }, [query_id]);

    if (loading) return <Loader />;
    if (!slides.length) return <p>No carousel data available</p>;

    return <Carousel slides={slides} rotation_time={rotationTime} />;
};

const slideTransitionDuration = 500;

const Carousel: React.FC<{ slides: Slide[]; rotation_time: number }> = ({
    slides,
    rotation_time,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(0);
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        slides.forEach(({ image }) => {
            const img = new Image();
            img.src = image;
        });
    }, [slides]);

    useEffect(() => {
        const timer = setTimeout(() => {
            goNext();
        }, (rotation_time || 3) * 1000);
        return () => clearTimeout(timer);
    }, [currentIndex, rotation_time]);

    const total = slides.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    const visibleSlides = [
        slides[prevIndex],
        slides[currentIndex],
        slides[nextIndex],
    ];

    const goTo = (newIndex: number, dir: 1 | -1) => {
        if (isAnimating) return;
        setDirection(dir);
        setIsAnimating(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex(newIndex);
            setIsAnimating(false);
            setDirection(0);
        }, slideTransitionDuration);
    };

    const goNext = () => goTo((currentIndex + 1) % total, 1);
    const goPrev = () => goTo((currentIndex - 1 + total) % total, -1);

    const translateXPercent = !isAnimating
        ? -100
        : direction === 1
            ? -200
            : 0;

    return (
        <div
            className="w-full overflow-hidden relative"
            style={{ position: "relative" }}
        >
            <div
                className="flex"
                style={{
                    transform: `translateX(${translateXPercent}%)`,
                    transition: isAnimating
                        ? `transform ${slideTransitionDuration}ms ease`
                        : "none",
                }}
            >
                {visibleSlides.map((slide, idx) => (
                    <div
                        key={idx}
                        className="flex-none w-full relative"
                        style={{ flex: "0 0 100%", position: "relative" }}
                    >
                        <img
                            src={slide.image}
                            alt=""
                            className="w-full"
                            style={{ objectFit: "contain" }}
                        />
                        <div
                            className="absolute bottom-0 w-full container"
                            style={{
                                color: "white",
                                padding: "1rem",
                                margin: "2rem 10%",
                            }}
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: slide.description,
                                }}
                            />
                            {slide.button && (
                                <a
                                    className="no-underline curved-button"
                                    href={slide.button.link}
                                >
                                    {slide.button.text}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* nav buttons */}
            <button
                onClick={goPrev}
                disabled={isAnimating}
                className="border-none cursor-pointer"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: 10,
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.4)",
                    color: "white",
                    fontSize: "2rem",
                    paddingBottom: "10px",
                }}
            >
                ‹
            </button>
            <button
                onClick={goNext}
                disabled={isAnimating}
                className="border-none cursor-pointer"
                style={{
                    position: "absolute",
                    top: "50%",
                    right: 10,
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.4)",
                    color: "white",
                    fontSize: "2rem",
                    paddingBottom: "10px",
                }}
            >
                ›
            </button>
        </div>
    );
};

export default CarouselWrapper;
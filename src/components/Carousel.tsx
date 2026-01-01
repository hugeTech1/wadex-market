import { useState, useEffect, useRef } from "react";
import { getUpcomingEventsData } from "../services/page.service";
import type { IUpcomingEvent } from "../types/page";
import Loader from "./Loader";

const Carousel = ({ shortCode }: { shortCode: string | undefined }) => {

    const [index, setIndex] = useState(0);
    const intervalRef = useRef<number | undefined>(undefined);
    const [events, setEvents] = useState<IUpcomingEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const next = () => {
        if (events.length === 0) return;
        setIndex((prev) => (prev + 1) % events.length);

        resetTimer();
    };

    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % events.length);
        }, 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!shortCode) return;

            setLoading(true);
            try {
                const res = await getUpcomingEventsData(shortCode);
                const data = res?.data;
                setEvents(Array.isArray(data) ? data : [data]);
                setIndex(0);
            } catch (error) {
                console.error("Query Data fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shortCode]);

    useEffect(() => {
        if (events.length === 0) return;
        resetTimer();
        return () => clearInterval(intervalRef.current);
    }, [events]);
    if (loading) return <Loader />;
    if (events.length === 0) return <></>;

    const front = events[index];
    const nextEvent = events[(index + 1) % events.length];

    return (
        <>
            <div className="container pt-8">
                <h3 className="page-title">
                    Upcoming<br />Events and Workshops
                </h3>
            </div>
            <div className="carousel container full-right">

                <div className="flex gap-2" onClick={next}>

                    {/* FRONT CARD */}
                    <div className="carousal-container">
                        <div
                            className="bg-cover bg-no-repeat bg-bottom"
                            style={{ backgroundImage: `url('${front.blogs_image}')` }}
                        >
                            <div className="carousal-card">
                                <h1 className="carousal-title">
                                    {front.blog_title}
                                </h1>
                            </div>
                        </div>
                    </div>
                    {events.length > 1 && (
                        <div className="carousal-container opacity-20">
                            <div
                                className="bg-cover bg-no-repeat bg-bottom"
                                style={{ backgroundImage: `url('${nextEvent.blogs_image}')` }}
                            >
                                <div className="carousal-card">
                                    <h1 className="carousal-title">
                                        {nextEvent.blog_title}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Carousel
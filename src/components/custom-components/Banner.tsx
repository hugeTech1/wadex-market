export interface BannerData {
    title: string;
    desc: string;
}

const Banner: React.FC<BannerData> = ({ title, desc }) => {
    return (
        <>
            <div className="banner">
                <div className="container">
                    <h1>{title}</h1>
                    <p>{desc}</p>
                </div>
            </div>
        </>
    );
};

export default Banner;
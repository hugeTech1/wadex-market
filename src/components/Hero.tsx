import type { IPageBlock } from "../types/page"
import Carousel from "./Carousel"

const Hero = ({ heroBlock } : {heroBlock : IPageBlock | undefined} ) => {

    return (
        <>
            <div style={{ backgroundImage: "url('/images/headerBg.png')" }} className="bg-cover bg-no-repeat bg-bottom">
                <div className="py-8 hero-image-content">
                    <div className="container pt-8 ">
                        <div className="flex justify-content-between">
                            <div className="max-w-900" 
                                dangerouslySetInnerHTML={{
                                    __html: heroBlock?.block_segment || ""
                                }}
                            />
                            <div className="flex flex-column align-items-center text-white opacity-40 pt-8">
                                <span className="rotate-90 mb-3 white-space-nowrap">Follow us</span>
                                <div className="border-1 h-8rem my-4"></div>
                                <i className="pi pi-facebook mb-2"></i>
                                <i className="pi pi-instagram mb-2"></i>
                                <i className="pi pi-twitter"></i>
                            </div>
                        </div>
                    </div>
                    <Carousel shortCode = {heroBlock?.blocks_shortcode} />
                </div>
            </div>
        </>
    )
}

export default Hero
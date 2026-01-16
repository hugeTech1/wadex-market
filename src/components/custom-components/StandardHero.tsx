import { stripHtml } from "../../utils/stripHtml";

const StandardHero = ({ data }: any) => {
  return (
    <>
      <div className="container">
        <div
          className="std-hero border-round-2xl flex align-items-center justify-content-start bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: data.blocks_bgimage ? `url(${data.blocks_bgimage})` : "none",
            minHeight: "580px",
          }}
        >
          <div
            className="px-4 xl:px-7 py-3 xl:py-4 pl-4 xl:pl-8  border-round-right-lg w-9 xl:w-auto"
            style={{ backgroundColor: "#e6b47a" }}
          >
            <h1 className="text-7xl xl:text-8xl w-9 xl:max-w-22rem font-medium m-0 line-height-1">
             {stripHtml(data.block_segment)}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default StandardHero;

import { Carousel } from "antd";


const CouncilVotingPanel = () => {
    return (
        <div className="box-container mb-4 py-6 px-6">
        <h4 className="mb-4 text-center text-lg">
          Proposals Awaiting Council Review
        </h4>
        <Carousel>
          <div className="box-container no-fill p-5 text-white">
            <h3 className="mb-4 text-lg">Storyboard for a Graphic Novel</h3>
            <p className="mb-4 text-sm font-light opacity-75">
              I would like to create a storyboard as a first step for a
              graphic novel for PopHeadz. I have experience in the comics
              industry and have storyboarded 40+ existing novels.{" "}
            </p>
            <div className="flex items-center justify-between text-lg">
              <p>$500 USDC</p>
              <p>4/5 Voted</p>
            </div>
          </div>

          <div className="box-container no-fill p-5 text-white">
            <h3 className="mb-4 text-lg">Storyboard for a Graphic Novel</h3>
            <p className="mb-4 text-sm font-light opacity-75">
              I would like to create a storyboard as a first step for a
              graphic novel for PopHeadz. I have experience in the comics
              industry and have storyboarded 40+ existing novels.{" "}
            </p>
            <div className="flex items-center justify-between text-lg">
              <p>$500 USDC</p>
              <p>4/5 Voted</p>
            </div>
          </div>
        </Carousel>
      </div>
    );
};

export default CouncilVotingPanel;

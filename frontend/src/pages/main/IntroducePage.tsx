import {JSX} from "react";
import { Helmet } from "react-helmet-async";
import IndexBackground from "../../views/ui/layout/IndexBackground";
import IntroduceSection from "../../views/feature/introduce/IntroduceSection";
import IntroduceImage from "../../views/feature/introduce/IntroduceImage";
import IntroduceMedia from "../../views/feature/introduce/IntroduceMedia";
import UniLevelSection from  "../../views/feature/home/UniLevelSection";
import "./IntroducePage.scss";

const CLASS_PAGE = "introduce";

const IntroducePage = (): JSX.Element => {
    return (
      <div>
      <Helmet>
        <title>Giới thiệu trường - Web tuyển sinh</title>
      </Helmet>
      <IndexBackground>
          <IntroduceSection className={CLASS_PAGE}/>
          <IntroduceImage/>
          <IntroduceMedia/>
          <UniLevelSection/>
      </IndexBackground>
    </div>
    );
};

export default IntroducePage;
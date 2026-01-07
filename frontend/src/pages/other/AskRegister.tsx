import {JSX} from "react";
import { Helmet } from "react-helmet-async";
import IndexBackground from "../../views/ui/layout/IndexBackground";
import HeroSection from "../../views/feature/home/HeroSection";
import "./AskRegister.scss";

const CLASS_PAGE = "home";

const AskRegister = (): JSX.Element => {
    return (
        <div>
      <Helmet>
        <title>Web tuyển sinh</title>
      </Helmet>
      <IndexBackground>
          <HeroSection/>
      </IndexBackground>
    </div>
    );
};

export default AskRegister;
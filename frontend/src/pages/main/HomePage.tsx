import {JSX, useState, useEffect} from "react";
import { Helmet } from "react-helmet-async";
import IndexBackground from "../../views/ui/layout/IndexBackground";
import HeroSection from "../../views/feature/home/HeroSection";
import KeyInfomation from "../../views/feature/home/KeyInformation";
import IntroduceSection from "../../views/feature/introduce/IntroduceSection";
import NewsSection from "../../views/feature/news/NewsSection";
import UniLevelSection from "../../views/feature/home/UniLevelSection";
import OutstadingStuSection from "../../views/feature/home/OutstadingStuSection";
import "./HomePage.scss";
import { useAuth } from "../../context/AuthContext";

const CLASS_PAGE = "home";

const HomePage = (): JSX.Element => {
    const {user} = useAuth();

    return (
        <div>
      <Helmet>
        <title>Trang chủ - Web tuyển sinh</title>
      </Helmet>
      <IndexBackground>
          {!user.isTeacher() && !user.isAdmin() && <HeroSection/>}
          <IntroduceSection className={CLASS_PAGE}/>
          <KeyInfomation/>
          <UniLevelSection/>
          <NewsSection/>
          <OutstadingStuSection/>
      </IndexBackground>
    </div>
    );
};

export default HomePage;
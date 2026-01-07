import {JSX} from "react";
import { Helmet } from "react-helmet-async";
import IndexBackground from "../../views/ui/layout/IndexBackground";
import NewsSection from "../../views/feature/news/NewsSection";
import OtherNewsSection from "../../views/feature/news/OtherNewsSection";
import "./NewsPage.scss";

const CLASS_PAGE = "news";

const NewsPage = (): JSX.Element => {
    return (
        <div>
      <Helmet>
        <title>Tin tức - Web tuyển sinh</title>
      </Helmet>
      <IndexBackground>
          <NewsSection className={CLASS_PAGE}/>
          <OtherNewsSection/>
      </IndexBackground>
    </div>
    );
};

export default NewsPage;
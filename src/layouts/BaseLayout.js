import { styled } from '@mui/material/styles';
import Aos from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";
import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/header/MainMenu";

const LayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const LayoutContent = styled('div')({
  flexGrow: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
})

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const BaseLayout = ({ children }) => {
  useEffect(() => {
    Aos.init({
      duration: 1200,
    });
  }, []);
  return (
    <LayoutWrapper>
      <LayoutContent className="main-page-wrapper">
        {children}
        <ScrollToTop />
      </LayoutContent>
    </LayoutWrapper>
  )
}

export default BaseLayout;
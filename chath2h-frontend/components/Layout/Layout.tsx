import {ReactNode} from 'react';
import Header from '../Header';
import Footer from '@components/Footer';
import useCheckIfUserIsActive from 'hooks/useCheckIfUserIsActive';
import ScrollTop from './ScrollTop';
import CookiesComponent from '@components/CookiesComponent';
import NewChatRequestModal from "@components/NewMessageModal/NewChatRequestModal";

interface LayoutProps {
    children?: ReactNode;
}

const Layout = ({children}: LayoutProps) => {
    useCheckIfUserIsActive();
    return (
        <>
            <Header/>
            <ScrollTop/>
            {children}
            <CookiesComponent/>
            <NewChatRequestModal/>
            <Footer/>
        </>
    );
};

export default Layout;

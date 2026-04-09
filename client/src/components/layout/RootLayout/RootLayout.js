import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import I18nLocaleSync from "../../routing/I18nLocaleSync";

export default function RootLayout() {
  return (
    <Fragment>
      <I18nLocaleSync />
      <Header />
      <Outlet />
      <Footer />
    </Fragment>
  );
}

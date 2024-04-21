import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { loadDynamicRoutes } from "@sonamu-kit/react-sui";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SWRConfig } from "swr";
import { swrFetcher } from "./services/sonamu.shared";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import Post from "./pages/post";
import { AuthProvider } from "./auth";
import LoginPage from "./pages/login";
import Join from "./pages/join";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SWRConfig
    value={{
      errorRetryInterval: 3000,
      errorRetryCount: 3,
      fetcher: swrFetcher,
      revalidateOnFocus: true,
    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/join" element={<Join />}></Route>
            {loadDynamicRoutes(import.meta.glob("./pages/**/*.tsx"))}
            <Route path="post/:id" element={<Post />} />
          </Route>
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </SWRConfig>
);

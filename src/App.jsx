import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "./pages/PageNotFound";
// import Login from "./pages/Login";

// this lazy fn would help the components to load as we need them and not all at once at the starting

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/Homepage"));
// vite or webpack will automatically split the bundle when they see this lazy fn

// dist/assets/index-7a322a2d.css   31.90 kB │ gzip:   5.27 kB
// dist/assets/index-44fa14f3.js   533.02 kB │ gzip: 150.52 kB

// while a part of the bundle load we use to Suspense API to suspend the loading of the component and display a spinner until it loads

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              {/* here we'd do the route definition */}
              <Route index element={<Homepage />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="product" element={<Product />} />
              <Route path="login" element={<Login />} />
              {/* path is the path specified in the url after the root
        element is the element to be rendered when that path is hit */}
              <Route path="*" element={<PageNotFound />} />
              {/* the above would handle all the usspecified routes */}

              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    {/* this would check whether the user is authenticated, then only render the AppLayout component */}
                    <AppLayout />
                  </ProtectedRoute> // we have wrapped the app layout in the protected layout because all the other further routes which needs to be accessed after logging in, go through this route. So if we protect this, all other are protected
                }
              >
                {/* we create nested routes here. Nested routes influence what components would be displayed inside another components */}
                <Route index element={<Navigate replace to="cities" />} />
                {/* <Navigate to="cities"/> would immediately redict us to the cities route(present down) when this default route is present */}
                {/* index means that this component is displayed by default when none of the nested routes match  */}
                <Route path="cities" element={<CityList />} />
                {/* this element will be displayed in the outlet element present in the sidebar component */}
                <Route path="cities/:id" element={<City />} />
                {/* :id is the param which is specified in the url */}
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;

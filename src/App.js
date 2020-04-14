import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Header from "./shared/components/navigation/Header";
import Recipes from "./recipes/pages/Recipes";
import NewRecipe from "./recipes/pages/NewRecipe";
import RecipeDetails from "./recipes/pages/RecipeDetails";
import Auth from "./user/pages/Auth";
import UserRecipes from "./user/pages/UserRecipes";
import EditRecipe from "./recipes/pages/EditRecipe";
import FavouriteRecipes from './recipes/pages/FavouriteRecipes';
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

function App() {
  const { login, logout, token, userId, favouriteRecipes } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Recipes />
        </Route>
        <Route path="/recipes/new" exact>
          <NewRecipe />
        </Route>
        <Route path="/recipe/edit/:id">
          <EditRecipe />
        </Route>
        <Route path="/recipes/favourite">
          <FavouriteRecipes />
        </Route>
        <Route path="/recipe/:id">
          <RecipeDetails />
        </Route>
        <Route path="/:id/recipes">
          <UserRecipes />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Recipes />
        </Route>
        <Route path="/recipe/:id">
          <RecipeDetails />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token,
          userId,
          login,
          logout,
          favouriteRecipes
        }}
      >
        <Router>
          <Header />
          <main> {routes}</main>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

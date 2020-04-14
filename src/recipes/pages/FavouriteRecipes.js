import React, { useEffect, useState, useContext } from 'react';
import { useHttp } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import RecipesList from '../components/RecipesList';

const FavouriteRecipes = (props) => {
    const { sendRequest, error, clearError, isLoading } = useHttp();
    const [recipes, setRecipes] = useState([])
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/recipes/favourite/all`, 'GET', null, {
                    Authorization: 'Bearer ' + auth.token
                })
                setRecipes(responseData);
            }
            catch (error) { }
        }

        fetchRecipes();
    }, [])

    if (recipes.length === 0 && !isLoading) {
        return (
            <p className="no-recipes-found">Nie masz jeszcze żadnych ulubionych przepisów.</p>
        )
    }

    if (isLoading) {
        return <LoadingSpinner />
    }
    return (
        <>
            <ErrorModal
                show={!!error}
                handleClose={clearError}
                error={error}
                type="error"
            />

            <div>
                <RecipesList recipes={recipes} />
            </div>

        </>);
}

export default FavouriteRecipes;
import React from "react";
import './RecipeVideo.css'; 
import Header from '../../components/Header/Header';

function RecipeVideo() {
  return (
    <>
      <Header />
      <div className="video-page-container">

        <div className="header-container">
          <h1 className="video-title">Delicious Chocolate Cake Recipe</h1>
          <p className="video-description">
            Watch this step-by-step guide on how to bake the perfect chocolate cake. 
            Follow the recipe and tips to create a mouth-watering dessert for any occasion!
          </p>
        </div>

        <div className="ingredients-container">
          <h3>Recipe Ingredients</h3>
          <ul>
            <li>1 1/2 cups of all-purpose flour</li>
            <li>1/2 cup of cocoa powder</li>
            <li>1 cup of sugar</li>
            <li>2 eggs</li>
            <li>1/2 cup of milk</li>
            <li>1/2 cup of vegetable oil</li>
            <li>1 tsp of vanilla extract</li>
            <li>1 tsp of baking powder</li>
          </ul>
        </div>

        <div className="instructions-container">
          <h3>Instructions</h3>
          <p>Follow these steps to bake your chocolate cake:</p>
          <ol>
            <li>Preheat your oven to 350°F (175°C).</li>
            <li>Mix the dry ingredients in one bowl.</li>
            <li>Beat the eggs, oil, and vanilla in another bowl.</li>
            <li>Combine both mixtures, pour into a baking pan, and bake for 30 minutes.</li>
            <li>Allow the cake to cool before serving!</li>
          </ol>
        </div>

        <div className="video-container">
          <video className="recipe-video" controls>
            <source
              src="https://media.istockphoto.com/id/2069419578/video/super-slow-motion-of-flying-asian-wok-noodles-with-prans-and-vegetable.mp4?s=mp4-640x640-is&k=20&c=9eZjm_j9eSSczQvscdnZnDRguOvYdT1WitmUhSEJ9xU=" // Replace with your video URL
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </>
  );
}

export default RecipeVideo;

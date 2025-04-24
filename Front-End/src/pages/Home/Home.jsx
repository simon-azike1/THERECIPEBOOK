import React from 'react'
import Header from '../../components/Header/Header'
import Hero from '../../components/Hero/Hero'
import Features from '../../components/Features/Features'
import PopularRecipes from '../../components/PopularRecipes/PopularRecipes'
import Newsletter from '../../components/Newsletter/Newsletter'
import Testimonials from '../../components/Testimonials/Testimonials'
import Footer from '../../components/Footer/Footer'

function Home() {
  return (
    <div>
        <Header />
        <Hero />
        <Features />
        <PopularRecipes />
        <Newsletter />
        <Testimonials />
        <Footer />
    </div>
  )
}

export default Home
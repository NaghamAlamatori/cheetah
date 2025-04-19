import React from 'react'
import ImageCarousel from '../components/ImageCarousel'
import AdBanner from '../components/AdBanner'
import SearchBar from '../components/SearchBar'
import CarSection from '../components/CarSection'
import CustomerReviews from '../components/CustomerReviews'

function Home() {
  return (
    <div className="space-y-8 text-gray-500">
      <ImageCarousel />
      <AdBanner />
      <div className="container mx-auto px-4">
        <SearchBar />
        <CarSection title="Featured Cars" type="featured" />
        <CarSection title="Latest Arrivals" type="latest" />
        <div className="text-white">
          <CustomerReviews />
        </div>
      </div>
    </div>
  )
}

export default Home
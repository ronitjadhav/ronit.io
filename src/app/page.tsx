import Header from "@/sections/HeroSection";
import Navbar from "@/components/Navbar";
import About from "@/sections/about";
import MapComponent from "@/components/openlayers-map/map";
import Footer from "@/sections/footer";


export default function Home() {
  return (
    <>
        <Navbar />
        <Header />
        <MapComponent />
        <About />
        <Footer />


    </>
  )
}

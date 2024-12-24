import Header from "@/sections/HeroSection";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/openlayers-map/map";
import Footer from "@/sections/footer";
import ProjectsShowcase from "@/sections/projects";


export default function Home() {
  return (
    <>
        <Navbar />
        <Header />
        <MapComponent />
        <ProjectsShowcase />
        <Footer />


    </>
  )
}

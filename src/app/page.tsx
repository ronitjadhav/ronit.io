import Header from "@/sections/HeroSection";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/openlayers-map/map";
import Footer from "@/sections/footer";
import ProjectsShowcase from "@/sections/projects";
import {ToastContainer} from "react-toastify";


export default function Home() {
  return (
      <>
          <Navbar/>
          <ToastContainer/>
          <div id={"home"}>
              <Header/>
          </div>
          <div id={"journey"}>
              <MapComponent/>
          </div>
          <div id={"projects"}>
              <ProjectsShowcase/>
          </div>
          <Footer/>


      </>
  )
}

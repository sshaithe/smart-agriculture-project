import React from "react";
// Atomik bileşenlerinizin import edildiğini varsayıyoruz
import Image from "../components/atomic_design/atom/Image"; 
import Text from "../components/atomic_design/atom/Text"; 
import Button from "../components/atomic_design/atom/Button";

const sections = [
  {
    title: "Our Vision for a Smarter Future",
    content:
      "Precision agriculture, powered by IoT and AI, is our core focus. We aim to revolutionize farming by providing real-time, actionable insights that reduce waste, increase yields, and promote ecological balance. Our commitment is to a sustainable and technologically advanced food system for the next generation. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam nisi recusandae dolores doloribus in vel, deserunt necessitatibus dicta soluta perspiciatis deleniti repudiandae neque architecto veritatis.",
    imageUrl:
      "https://media.istockphoto.com/id/1346294867/photo/smart-farming-concept.jpg?s=612x612&w=0&k=20&c=wwiWQWIaTAojgCV8lOplPh4cA8g2spKbESFD-nV7TVA=",
    alt: "Farmer using a tablet in a modern greenhouse, representing smart farming technology.",
  },
  {
    title: "Harnessing Data for Sustainable Growth",
    content:
      "Data is the new fertilizer. Our platform aggregates inputs from sensors, drones, and satellite imagery to create comprehensive health maps of your fields. This allows for hyper-localized management of water, nutrients, and pest control, resulting in resource efficiency and superior crop quality. Accusantium modi aspernatur, consequuntur blanditiis dolore distinctio reprehenderit cupiditate placeat explicabo. Animi pariatur error facilis ipsam minima labore odit itaque odio, molestiae ad deserunt voluptas sunt?",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiShCGsvQOoxle-p-nxZU9mWkKN3sCMkG5Tw&s",
    alt: "Infographic showing data analytics and charts over a field of crops.",
  },
];

const About = () => {
  return (
    <div className="bg-transparent min-h-screen"> 
      <div className="container mx-auto px-4 py-16 md:py-24">
        
        <header className="text-center mb-16 md:mb-20">
          <Text
            children={"About Smart Agriculture"}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight"
          />
          <Text
            children="Pioneering the future of agriculture through technology and innovation."
            className="text-xl text-indigo-600 max-w-4xl mx-auto font-medium"
          />
          <div className="mt-8">
          </div>
        </header>

        <main className="space-y-20 md:space-y-32">
          {sections.map((section, index) => (
            <section
              key={index}
              className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
            >              <div
                className={`w-full md:w-1/2 relative p-1 transition-all duration-500
                  ${index % 2 !== 0 ? "md:order-2" : "shadow-2xl hover:shadow-indigo-500/30"}
                `}
              >
                <Image
                  image={section.imageUrl}
                  alt={section.alt}
                  className="rounded-xl object-cover w-full h-96 transition-transform duration-500 hover:scale-[1.01]"
                />
                {index % 2 === 0 && (
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200/50 rounded-xl transform translate-x-3 translate-y-3 -z-10 hidden md:block"></div>
                )}
              </div>
              
              <div
                className={`w-full md:w-1/2 ${
                  index % 2 !== 0 ? "md:order-1" : ""
                } p-4`}
              >
                <Text children={`0${index + 1}`} className="text-sm font-semibold uppercase text-indigo-400 mb-2 tracking-widest" />
                
                <h3 className="text-4xl font-bold text-gray-800 mb-5 leading-snug">
                  {section.title}
                </h3>
                <Text children={section.content} className="text-lg text-gray-600 leading-relaxed border-l-4 border-indigo-400 pl-4 py-1">
                  
                </Text>
                
                <Button children={"Discovery Us"} className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
                </Button>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default About;
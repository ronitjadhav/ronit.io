import Link from 'next/link';
import ronitImage from '@/media/ronit.png';
import Image from 'next/image'; // Make sure this path points to your image

async function LinkPreview() {
  return (
    <Link
      href={'https://www.linkedin.com/in/ronitjadhav/'} // Replace with your LinkedIn or any other URL
      target="_blank"
      className="text-black w-[50%] h-[200px] cursor-pointer flex items-center bg-[#f3f3f3] gap-3 text-left border-white border-[2px]"
      style={{
        textDecoration: 'none',
      }}
    >
      <div className="object-cover h-full">
        <Image
          src={ronitImage} // Your image
          alt="Ronit Jadhav"
          className="object-cover h-full w-[340px] m-0"
        />
      </div>
      <div className="p-4 w-[60%]">
        <h3 className="text-3xl font-bold leading-[2rem] mb-2 ">
          Ronit Jadhav - Geospatial Developer
        </h3>
        <p className="text-base line-clamp-3 mb-2 ">
          ronitImageBased in Germany, I&#39;m a Geospatial Developer and a Software Engineer. I love
          to work with maps, data, and code. I&#39;m passionate about open-source, web technologies,
          and building cool stuff.
        </p>
        <span className="mt-3 opacity-50 text-xs">
          &nbsp;{'https://www.linkedin.com/in/ronitjadhav/'}
        </span>
      </div>
    </Link>
  );
}

export default LinkPreview;

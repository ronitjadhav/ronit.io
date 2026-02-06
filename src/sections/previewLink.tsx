import Link from 'next/link';
import ronitImage from '@/media/ronit.png';
import Image from 'next/image';
import { siteConfig, siteUrls } from '@/data/site-config';

async function LinkPreview() {
  return (
    <Link
      href={siteUrls.linkedin}
      target="_blank"
      className="text-black w-full sm:w-[80%] md:w-[50%] h-auto sm:h-[200px] cursor-pointer flex flex-col sm:flex-row items-center bg-[#f3f3f3] gap-3 text-left border-white border-[2px]"
      style={{
        textDecoration: 'none',
      }}
    >
      <div className="object-cover h-[150px] sm:h-full w-full sm:w-auto">
        <Image
          src={ronitImage}
          alt={siteConfig.name}
          className="object-cover h-full w-full sm:w-[340px] m-0"
        />
      </div>
      <div className="p-3 sm:p-4 w-full sm:w-[60%]">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight sm:leading-[2rem] mb-2">
          {siteConfig.name} - {siteConfig.jobTitle.split('&')[0].trim()}
        </h3>
        <p className="text-sm sm:text-base line-clamp-3 mb-2">{siteConfig.bio}</p>
        <span className="mt-3 opacity-50 text-xs">&nbsp;{siteUrls.linkedin}</span>
      </div>
    </Link>
  );
}

export default LinkPreview;

import { useState } from "react";
import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        onMouseEnter={() => setIsVideo(true)}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        <Image 
          src={props.image} 
          alt={props.alt || "Project Thumbnail"} 
          width={800} 
          height={400} 
          sizes="(max-width: 1025px) 100vw, 50vw"
        />
        {isVideo && props.video && <video src={`/${props.video}`} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;

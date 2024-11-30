import "../../assets/stylings/Footer.css";

import LogoImg from "../../assets/images/logo/logo1.png";
import DiscordImg from "../../assets/images/discord.png";
import TwitterImg from "../../assets/images/twitter.png";
import InstaImg from "../../assets/images/instagram.png";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RuneFooter = () => {
  return (
    <>
      <div className="rune-footer flex justify-around items-center">
        <div className="side-a flex flex-col">
          <div className="logo flex flex-row">
            <a href="/" target="_blank">
              <img src={LogoImg} className="w-32 h-auto" />
            </a>
            <a href="https://www.google.com/maps/" target="_blank">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="ml-12 w-12 h-auto mt-10"
              />
            </a>
          </div>
          <div className="text flex flex-row mt-10 mb-10">
            <a href="#" target="_blank">
              <p className="ml-3 mr-4">PRIVACY POLICY</p>
            </a>
  
            <a href="mailto:niraulasuchak@gmail.com">
              <p className="mx-3">CONTACT US</p>
            </a>
          </div>
        </div>
        <div className="side-b flex flex-col">
          <div className="top font-bold text-lg md:mb-4 mb-0">
            <p>Follow Us</p>
          </div>
          <div className="side-b">
            <a href="https://www.instagram.com" target="_blank">
              <img src={InstaImg} />
            </a>
            <a href="https://discord.com" target="_blank">
              <img src={DiscordImg} />
            </a>

            <a href="https://twitter.com" target="_blank">
              <img src={TwitterImg} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default RuneFooter;

import OfferCard from "./OfferCard";

import BookImg from "../assets/images/book-genres-1024x914.png";
import GiftImg from "../assets/images/delivery.jpg";

const Feature = () => {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center md:mb-10 ">
      <div className="text-center mt-10">
        <h3 className="bona text-blue-900 md:text-[40px] text-[30px] font-bold">
          What we offer{" "}
        </h3>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-8 text-center my-6">
        <div className="max-w-[360px] mx-auto">
          <OfferCard
            icon={BookImg}
            title="Best Book Selection"
            description=" From bestsellers to hidden gems, our collection is carefully selected to cater to diverse tastes and interests."
          />
        </div>
        <div className="max-w-[360px] mx-auto">
          <OfferCard
            icon={GiftImg}
            title="Fast Delivery Services "
            description="Easier and Faster Delivery Services so you dont miss out."
          />
        </div>
      </div>
    </div>
  );
};

export default Feature;

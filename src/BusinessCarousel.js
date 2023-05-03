import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

function BusinessCarousel(props) {
  const {photos} = props;
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {
        photos.map( (photo, index) =>
      <Carousel.Item key={index}>
        <img
          className="d-block w-100"
          src={photo}
          alt="First slide"
        />
      </Carousel.Item>
)}
    </Carousel>
  );
}

export default BusinessCarousel;
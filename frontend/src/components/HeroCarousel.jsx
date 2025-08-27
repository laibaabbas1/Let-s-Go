import React from 'react';
import { Carousel } from 'react-bootstrap';

import slideImage1 from '../assets/carouselimages/img1.jpg';
import slideImage2 from '../assets/carouselimages/img2.jpg';
import slideImage3 from '../assets/carouselimages/img3.jpg';

function HeroCarousel() {
    return (
        <Carousel fade interval={4000}>
            <Carousel.Item>
                <img
                    className="d-block w-100 carousel-image"
                    src={slideImage1}
                    alt="First slide"
                />
                <Carousel.Caption className="carousel-text-content">
                    <h1 className="display-4 fw-bold">Find Your Next Flight</h1>
                    <p className="lead">Book domestic flights within Pakistan easily and securely.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100 carousel-image"
                    src={slideImage2}
                    alt="Second slide"
                />
                <Carousel.Caption className="carousel-text-content">
                    <h1 className="display-4 fw-bold">Explore Amazing Places</h1>
                    <p className="lead">Get the best fares for your dream destinations.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100 carousel-image "
                    src={slideImage3}
                    alt="Third slide"
                />
                <Carousel.Caption className="carousel-text-content">
                    <h1 className="display-4 fw-bold">Travel with Confidence</h1>
                    <p className="lead">Your trusted partner for cheap air tickets.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default HeroCarousel;
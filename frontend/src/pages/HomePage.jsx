import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Carousel } from 'react-bootstrap'; 
import FlightSearchForm from '../components/FlightSearchForm';
import Chatbot from '../components/Chatbot';
import HeroCarousel from '../components/HeroCarousel';
import RouteMap from '../components/RouteMap';
import { pakistaniAirports } from '../data/airports.js';
import './HomePage.css'; 

const citiesData = [
    {
        name: 'Karachi',
        thumbnail: '/gallery/karachi/thumbnail.jpg',
        media: [
            { type: 'image', src: '/gallery/karachi/Merewethermemorialtower.jpg', caption: ' Merewether Memorial Tower' },
            { type: 'image', src: '/gallery/karachi/tentalwar.jpg', caption: 'Teen Talwar Monument' },
            { type: 'image', src: '/gallery/karachi/mizareqaid.jpg', caption: 'Mazar-e-Quaid' },
        ]
    },
    {
        name: 'Lahore',
        thumbnail: '/gallery/lahore/thumbnail.jpeg',
        media: [
            { type: 'image', src: '/gallery/lahore/badshahimasjid.jpg', caption: 'The majestic Badshahi Mosque' },
            { type: 'image', src: '/gallery/lahore/Arfa.jpg', caption: 'Software Technology Park' },
            { type: 'image', src: '/gallery/lahore/airport.jpg', caption: 'Allama Iqbal Airport' },
            { type: 'image', src: '/gallery/lahore/lahoremeuseum.jpg', caption: 'Lahore Museum' },
            { type: 'image', src: '/gallery/lahore/shahiqila.jpg', caption: 'Lahore Fort' },
            { type: 'image', src: '/gallery/lahore/minarepak.jpg', caption: 'Minar-e-Pakistan' }

        ]
    },
    {
        name: 'Islamabad',
        thumbnail: '/gallery/islamabad/thumbnail.jpg',
        media: [
            { type: 'image', src: '/gallery/islamabad/centaurausmall.jpg', caption: 'Centaurus Mall' },
            { type: 'image', src: '/gallery/islamabad/faisalmasjid.jpg', caption: 'Faisal Masjid' },
            { type: 'image', src: '/gallery/islamabad/marglahills.jpg', caption: 'Lush greenery of the capital-Mrghla Hills' },
            { type: 'image', src: '/gallery/islamabad/heritagemeuseum.jpg', caption: 'Heretage Museum' },
            { type: 'image', src: '/gallery/islamabad/monoment.jpg', caption: 'Monument' }
        ]
    },
    {
        name: 'Peshawar',
        thumbnail: '/gallery/peshawar/thumbnail.jpeg',
        media: [
            { type: 'image', src: '/gallery/islamabad/Bab-e-khyber.jpg', caption: 'Bab-e-khyber' },
            { type: 'image', src: '/gallery/islamabad/cunningumclocktower.jpg', caption: 'Cunningham Clock Tower' },
            { type: 'image', src: '/gallery/islamabad/islamiaclg.jpg', caption: 'Islamia College' }
        ]
    }
];

function HomePage() {
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);

    // Gallery ke liye naya state
    const [showModal, setShowModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);

    const handleLocationChange = (type, code) => {
        const airport = pakistaniAirports[code];
        if (type === 'origin') {
            setOrigin(airport || null);
        } else if (type === 'destination') {
            setDestination(airport || null);
        }
    };

    // Gallery ke liye naye functions
    const handleFolderClick = (city) => {
        setSelectedCity(city);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCity(null);
    };

    return (
        <div className="homepage-wrapper">
            <HeroCarousel />
            <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <FlightSearchForm onLocationChange={handleLocationChange} />
                    </div>
                </div>
            </div>
            <div className="container my-5">
                <h3 className="text-center mb-4 display-5 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }} >Live Route Preview</h3>
                <RouteMap origin={origin} destination={destination} />
            </div>

            {/* GALLERY SECTION  */}
            <div className="gallery-section">
                <Container>
                    <h2 className="text-center mb-4 display-5 fw-bold gallery-title" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>Explore Our Destinations</h2>
                    <Row>
                        {citiesData.map((city, index) => (
                            <Col md={6} lg={4} key={index} className="mb-4">
                                <Card className="city-folder-card" onClick={() => handleFolderClick(city)}>
                                    <Card.Img src={city.thumbnail} alt={city.name} className="city-folder-img" />
                                    <Card.ImgOverlay>
                                        <Card.Title>{city.name}</Card.Title>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
            {/* ==================================================================== */}

            {/* Gallery ka Modal (Popup) - Yeh background mein rahega aur click par dikhega */}
            {selectedCity && (
                <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedCity.name} Gallery</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        <Carousel interval={null}>
                            {selectedCity.media.map((item, index) => (
                                <Carousel.Item key={index} className="gallery-carousel-item">
                                    {item.type === 'image' ? (
                                        <img className="d-block w-100" src={item.src} alt={item.caption} />
                                    ) : (
                                        <video className="d-block w-100" controls src={item.src} />
                                    )}
                                    <Carousel.Caption>
                                        <p>{item.caption}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Modal.Body>
                </Modal>
            )}

            <Chatbot />
        </div>
    );
}

export default HomePage;
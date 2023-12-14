import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, FormControl, Button } from 'react-bootstrap';
import './App.css';
import jsonData from './data.json';

const Key = 'a1970357721e47f6941c4fc09d42af48';
const publishedAt = "publishedAt";
const popularity = "popularity";
const relevancy = "relevancy";
const initialPage = 1; 
const cardsPerPage = 24; 
let totalArticles = 0;
let totalPages = 1;
//let URL = `https://newsapi.org/v2/everything?&apiKey=${Key}&page=${initialPage}`;


const borderColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];

function NewsCard({ title, text, imgSrc, url, publishedDate, index }) {
  const borderColor = borderColors[index % borderColors.length]; 


  const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card border={borderColor}>
      <div className="image-container">
        <Card.Img variant="top" src={imgSrc} style={{ width: '100%', height: '200px' }} />
        <div className="published-date">{formattedDate}</div>
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
        <Button variant={borderColor} onClick={() => window.open(url, '_blank')}>
          Go to Article
        </Button>
      </Card.Body>
    </Card>
  );
}

function HomePage(props) {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortOption, setSortOption] = useState(publishedAt); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortBy = (sort) => {
    setSortOption(sort);
    setCurrentPage(initialPage); 
  };

  useEffect(() => {
    const getNewsData = async () => {
      try {
        const updatedURL = `https://newsapi.org/v2/everything?q=apple&sortBy=${sortOption}&apiKey=${Key}&page=${currentPage}`;
        
        const response = await fetch(updatedURL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setNewsData(data.articles);
        totalArticles = data.articles.length;
        totalPages = Math.ceil(totalArticles / cardsPerPage);
      } catch (error) {
        setError(error.message);
      }
    };
    getNewsData();
  }, [sortOption, currentPage]);

  // useEffect(() => {
  //   const getNewsData = async () => {
  //     try {
        
  //       setNewsData(jsonData.articles);
  //       totalArticles = jsonData.articles.length;
  //       totalPages = Math.ceil(totalArticles / cardsPerPage);
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   getNewsData();
  // }, []);


  const updateURL = () => {
    URL = `https://newsapi.org/v2/everything?q=apple&sortBy=${publishedAt}&apiKey=${Key}&page=${currentPage}`;
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = Math.min(startIndex + cardsPerPage, totalArticles);
  const filteredNews = newsData
    .filter((newsItem) => newsItem && newsItem.title && newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(startIndex, endIndex);


  useEffect(() => {
    updateURL();
  }, [currentPage]);



  return (
    <div>
      <div className="myHeader">
        <h1>Apple News</h1>
        <div className='search-bar'>
          <Form>
            <FormControl
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form>
        </div>
      </div>
      <div className='sortNews'>
        <div>
          <Button variant="primary" onClick={() => handleSortBy("publishedAt")}>
            Latest
          </Button>
        </div>
        <div>
          <Button variant="primary" onClick={() => handleSortBy("popularity")}>
            Popularity
          </Button>
        </div>
        <div>
          <Button  onClick={() => handleSortBy("relevancy")}>
            Relevancy
          </Button>
        </div>
      </div>
      <div className="myContainer">
        {filteredNews.length === 0 ? (
          <div className="notFound">
            <p>No results found, please try something else.</p>
          </div>
        ) : (
          <Row xs={1} md={3} className="myCards">
            {filteredNews.map((newsItem, index) => (
              <Col key={index} className="myCard">
                <NewsCard
                  title={newsItem.title}
                  text={newsItem.description}
                  imgSrc={newsItem.urlToImage}
                  url={newsItem.url}
                  publishedDate={newsItem.publishedAt} 
                  index={index}
                />
              </Col>
            ))}
          </Row>
        )}
        <div className="pagination">
          <Button variant="primary" onClick={handlePrevPage} disabled={currentPage === 1}>
            Back
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button variant="primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

HomePage.propTypes = {};
export default HomePage;

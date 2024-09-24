import React, { useState, useEffect } from 'react';
import EverythingCard from './EverythingCard';
import Loader from './Loader';
import translateText from './translateApi';

function AllNews() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedText, setTranslatedText] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState('en'); // default language

  const pageSize = 12;

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError(null);
    fetch(`https://news-aggregator-dusky.vercel.app/all-news?page=${page}&pageSize=${pageSize}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(myJson => {
        if (isMounted) {
          if (myJson.success) {
            setTotalResults(myJson.data.totalResults);
            setData(myJson.data.articles);
          } else {
            setError(myJson.message || 'An error occurred');
          }
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        if (isMounted) {
          setError('Failed to fetch news. Please try again later.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => { isMounted = false };
  }, [page]);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handleTranslate = async (language) => {
    setTargetLanguage(language);
    const translatedArticles = await Promise.all(
      data.map((article) => translateText(article.description, language))
    );
    setTranslatedText(translatedArticles);
  };

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className='my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3'>
        {!isLoading ? (
          data.length > 0 ? (
            data.map((element, index) => (
              <EverythingCard
                key={index}
                title={element.title}
                description={translatedText[index] || element.description}
                imgUrl={element.urlToImage}
                publishedAt={element.publishedAt}
                url={element.url}
                author={element.author}
                source={element.source.name}
              />
            ))
          ) : (
            <p>No news articles found for this criteria.</p>
          )
        ) : (
          <Loader />
        )}
      </div>
      {!isLoading && data.length > 0 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button disabled={page <= 1} className='pagination-btn text-center' onClick={handlePrev}>&larr; Prev</button>
          <p className='font-semibold opacity-80'>{page} of {Math.ceil(totalResults / pageSize)}</p>
          <button className='pagination-btn text-center' disabled={page >= Math.ceil(totalResults / pageSize)} onClick={handleNext}>Next &rarr;</button>
        </div>
      )}
      <div className="translate-controls">
        <select value={targetLanguage} onChange={(e) => handleTranslate(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          {/* add more languages as needed */}
        </select>
      </div>
    </>
  );
}

export default AllNews;
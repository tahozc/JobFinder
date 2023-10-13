import React, { Fragment, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const Pagination = ({
  currentPage,
  setCurrentPage,
  items,
  totalPages,
  setTotalPages,
  itemsPerPage,
  setpaginatedItems,
}) => {
  useEffect(() => {
    if (items && itemsPerPage) {
      const totalItems = items.length;
      const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
      setTotalPages(totalPagesCount);
    }
    if (items && itemsPerPage && currentPage === 1) {
      const startIndex = 0;
      const endIndex = Math.min(itemsPerPage, items.length);
      const initialPaginatedItems = items.slice(startIndex, endIndex);
      setpaginatedItems(initialPaginatedItems);
    }
  }, [items, itemsPerPage, currentPage]);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      const startIndex = (newPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, items.length);
      const slicedItems = items.slice(startIndex, endIndex);
      setpaginatedItems(slicedItems);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);

      const startIndex = (newPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, items.length);
      const slicedItems = items.slice(startIndex, endIndex);
      setpaginatedItems(slicedItems);
    }
  };

  const renderPaginationItems = () => {
    const paginationItems = [];
    const maxPagesToShow = 5;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = currentPage - halfMaxPagesToShow;
    let endPage = currentPage + halfMaxPagesToShow;

    if (startPage <= 0) {
      startPage = 1;
      endPage = Math.min(totalPages, maxPagesToShow);
    } else if (endPage > totalPages) {
      startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <div
          key={i}
          className={`pagination-item ${i === currentPage ? "selected" : ""}`}
          onClick={() => {
            setCurrentPage(i);
            const startIndex = (i - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, items.length);
            const slicedItems = items.slice(startIndex, endIndex);
            setpaginatedItems(slicedItems);
          }}
        >
          {i}
        </div>
      );
    }

    return paginationItems;
  };

  return (
    <Fragment>
      {items.length > itemsPerPage ? (
        <Fragment>
          <div className="pagination-container">
            {items.length > 0 && (
              <div
                className="pagination-item back"
                onClick={handlePreviousClick}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            )}

            {renderPaginationItems()}
            {items.length > 0 && (
              <div className="pagination-item back" onClick={handleNextClick}>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            )}
          </div>
        </Fragment>
      ) : (
        <Fragment></Fragment>
      )}
    </Fragment>
  );
};

export default Pagination;

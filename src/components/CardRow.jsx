import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function CardRow({ title, subtitle, cards, highlight, anchorId, isTrending }) {
  const carouselRef = useRef(null);

  const handleScroll = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollAmount = carousel.clientWidth * 0.8;
    carousel.scrollBy({ left: scrollAmount * direction, behavior: "smooth" });
  };

  return (
    <section
      className={`row ${highlight ? "is-active-row" : ""} ${isTrending ? "is-trending-row" : ""}`}
      id={anchorId}
    >
      <div className="row-header">
        <div>
          <h2>{title}</h2>
          <span className="row-subtitle">{subtitle}</span>
        </div>
        <div className="row-actions">
          <button className="nav-btn" type="button" onClick={() => handleScroll(-1)}>
            ◀
          </button>
          <button className="nav-btn" type="button" onClick={() => handleScroll(1)}>
            ▶
          </button>
        </div>
      </div>
      <div className="card-strip" data-carousel ref={carouselRef}>
        {cards.map((card) => (
          <Link
            className={`card ${card.rank ? "ranked" : ""}`}
            key={card.title}
            to="/reading"
            style={{ "--card-image": `url('${card.image}')` }}
          >
            {card.rank ? <span className="rank">{card.rank}</span> : null}
            <span className="card-title">{card.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

CardRow.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      rank: PropTypes.number,
    })
  ).isRequired,
  highlight: PropTypes.bool,
  anchorId: PropTypes.string,
  isTrending: PropTypes.bool,
};

CardRow.defaultProps = {
  highlight: false,
  anchorId: undefined,
  isTrending: false,
};

import React, { Component } from 'react';

import './BeerDetails.css';

export default function BeerDetails({ data, closeDetails, isDetailsLoaded }) {
  if (!isDetailsLoaded) {
    return (
      <div className="modal-window">
        <div className="modal-window__content col-8">
          <div className="modal-window__body">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-window">
      <div className="modal-window__content col-8">
        <div className="modal-window__body">
          <div className="row">
            <div className="modal-window__image-wrapper col-4">
              <img src={data.image_url} />
            </div>
            <div className="modal-window__description col-8">
              <h2>{data.name}</h2>
              <i>{data.tagline}</i>
              <hr />
              <p>{data.description}</p>
              <button
                type="button"
                className="btn btn-info"
                onClick={closeDetails}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

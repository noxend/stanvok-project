import React from 'react';
import TableItem from '../TableItem';
import BeerDetails from '../BeerDetails';
import axios from 'axios';

import service from '../../services/PunkAPI.service';

import './Catalog.css';

export default class Catalog extends React.Component {
  state = {
    itemId: null,
    details: {},
    beers: [],
    isListLoaded: false,
    isDetailsLoaded: false,
    countResults: 20,
    page: 1
  };

  selectItem = id => {
    if (id !== this.state.itemId) {
      this.props.history.push(`/catalog/${id}`);
    } else {
      this.props.history.push(`/catalog`);
      this.setState({ itemId: null, isDetailsLoaded: false, details: {} });
    }
  };

  updatedDetails = () => {
    const { itemId } = this.state;

    if (itemId) {
      service.getSingle(itemId).then(result => {
        this.setState({
          details: result[0],
          isDetailsLoaded: true
        });
      });
    }
  };


  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.getData(this.state.page);
    this.pagination();
    this.setState({ itemId: parseInt(id) }, () => {
      this.updatedDetails();
    });
  };

  componentDidUpdate = (prewProps, prewState) => {
    const { id } = this.props.match.params;
    if (prewState.itemId !== parseInt(id) && id) {
      this.setState({ itemId: parseInt(id) }, () => {
        this.updatedDetails();
      });
    }
  };

  closeDetails = () => {
    this.setState({ itemId: null, isDetailsLoaded: false, details: {} });
    this.props.history.push(`/catalog`);
  };

  pagination = () => {
    let items = [];
    const countPages = Math.ceil(325 / this.state.countResults);

    for (let i = 1; i <= countPages; i++) {
      items.push(
        <li key={i} className={`page-item ${i === this.state.page ? 'active' : ''}`} onClick={ () => { this.getData(i) } }>
          <div className="page-link">
            {i}
          </div>
        </li>
      );
    }
    return items;
  };

  getData = (page) => {
    console.log((page <= 0) ? (page >= 7) : page)
    axios.get(`/beers?page=${page}&per_page=${this.state.countResults}`).then(result => {
      this.setState({ beers: result.data, isListLoaded: true, page })
    });
  };

  render = () => {
    const {
      itemId,
      details,
      beers,
      isListLoaded,
      isDetailsLoaded
    } = this.state;

    if (!isListLoaded) {
      return <h3>Loading...</h3>;
    }

    return (
      <div className="catalog">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Tagline</th>
              <th scope="col">First Brewed</th>
            </tr>
          </thead>
          <tbody>
            {beers.map(item => (
              <TableItem
                key={item.id}
                {...item}
                selectItem={this.selectItem}
                itemId={itemId}
              />
            ))}
          </tbody>
        </table>
        {this.state.itemId ? (
          <BeerDetails
            itemId={itemId}
            closeDetails={this.closeDetails}
            data={details}
            isDetailsLoaded={isDetailsLoaded}
          />
        ) : null}
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item" onClick={() => { this.getData(this.state.page - 1) }}>
              <div className="page-link" href="#" tabindex="-1">
                Previous
              </div>
            </li>
            {this.pagination()}
            <li className="page-item" onClick={() => { this.getData(this.state.page + 1) }}>
              <div className="page-link" href="#">
                Next
              </div>
            </li>
          </ul>
        </nav>
      </div>
    );
  };
}

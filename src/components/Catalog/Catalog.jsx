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
    countResults: 30,
    page: 1,
    searchByName: ''
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

    if (itemId && this.state.details.id !== itemId) {
      service.getSingle(itemId).then(result => {
        this.setState({
          details: result[0],
          isDetailsLoaded: true
        });
      });
    } else {
      this.setState({
        details: this.state.details,
        isDetailsLoaded: true
      });
    }
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.getData(this.state.page);
    this.pagination();
    this.setState({ itemId: parseInt(id) });
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
    this.setState({ itemId: null, isDetailsLoaded: false });
    this.props.history.push(`/catalog`);
  };

  pagination = () => {
    let items = [];
    const countPages = Math.ceil(325 / this.state.countResults);

    for (let i = 1; i <= countPages; i++) {
      items.push(
        <li
          key={i}
          className={`page-item ${i === this.state.page ? 'active' : ''}`}
          onClick={() => {
            this.setState(
              {
                page: i
              },
              () => {
                this.getData(this.state.page);
              }
            );
          }}
        >
          <div className="page-link">{i}</div>
        </li>
      );
    }
    return items;
  };

  getData = () => {
    this.setState({ isListLoaded: false });
    axios
      .get(`/beers?page=${this.state.page}&per_page=${this.state.countResults}`)
      .then(result => {
        this.setState({ beers: result.data, isListLoaded: true }, () => {
          console.log(this.state.beers);
        });
      });
  };

  getDataBySearch = () => {   
    this.setState({ isListLoaded: false });
    axios
      .get(
        `/beers?beer_name=${this.state.searchByName}&page=${
          this.state.page
        }&per_page=${this.state.countResults}`
      )
      .then(result => {
        this.setState({ beers: result.data, isListLoaded: true }, () => {
          console.log(this.state.beers);
        });
      });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState(
      {
        page: 1
      },
      () => {
        this.getDataBySearch();
      }
    );
  };

  handleChange = e => {
    this.setState(
      {
        searchByName: e.target.value
      },
      () => {
        if (!this.state.searchByName) {
          this.getData(1);
        }
      }
    );
  };

  incPage = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        if (this.state.searchByName) {
          this.getDataBySearch();
        } else {
          this.getData(this.state.page);
        }
      }
    );
  };

  decPage = () => {
    this.setState(
      {
        page: this.state.page - 1
      },
      () => {
        if (this.state.searchByName) {
          this.getDataBySearch();
        } else {
          this.getData(this.state.page);
        }
      }
    );
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
              <th scope="col">
                Name
                <form onSubmit={this.onSubmit}>
                  <input
                    type="text"
                    onChange={this.handleChange}
                    className="form-control"
                    value={this.state.searchByName}
                  />
                </form>
              </th>
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
          {(() => {
            if (this.state.searchByName) {
              return (
                <ul className="pagination justify-content-center">
                  {this.state.page === 1 ? (
                    ''
                  ) : (
                    <li
                      className="page-item"
                      onClick={() => {
                        this.decPage();
                      }}
                    >
                      <div className="page-link" href="#" tabIndex="-1">
                        Previous
                      </div>
                    </li>
                  )}
                  {this.state.countResults !== this.state.beers.length ? (
                    ''
                  ) : (
                    <li
                      className="page-item"
                      onClick={() => {
                        this.incPage();
                      }}
                    >
                      <div className="page-link" href="#">
                        Next
                      </div>
                    </li>
                  )}
                </ul>
              );
            } else {
              return (
                <ul className="pagination justify-content-center">
                  {this.state.page === 1 ? (
                    ''
                  ) : (
                    <li
                      className="page-item"
                      onClick={() => {
                        this.decPage();
                      }}
                    >
                      <div className="page-link" href="#" tabIndex="-1">
                        Previous
                      </div>
                    </li>
                  )}
                  {this.pagination()}
                  {this.state.countResults !== this.state.beers.length ? (
                    ''
                  ) : (
                    <li
                      className="page-item"
                      onClick={() => {
                        this.incPage();
                      }}
                    >
                      <div className="page-link" href="#">
                        Next
                      </div>
                    </li>
                  )}
                </ul>
              );
            }
          })()}
        </nav>
      </div>
    );
  };
}

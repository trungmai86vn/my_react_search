import React from 'react';
import axios from 'axios';
import PixabayAPI from '../api/PixabayAPI';
import "./Search.css";
import Loader from '../images/loader.gif'

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: ''
        };

        this.cancelSource = null;
    }

    handleOnInputChange = (event) => {
        const query = event.target.value;
        this.setState({query:query, loading:true, message:""}, () => {
            this.fetchSearchResult(1, query);
        });
    };

    fetchSearchResult = (updatedPageNo="", query) => {
        if(this.cancelSource){
            this.cancelSource.cancel();
        }

        this.cancelSource = axios.CancelToken.source();

        const searchParms = `&q=${query}&page=${updatedPageNo}`;

        PixabayAPI.get(searchParms, {
            cancelToken: this.cancelSource.token,
        }).then((res) => {
            console.log(res.data);
            const resultNotFoundMsg = !res.data.hits.length ? "There are no more search results. Please try a new search." : "";

            this.setState({results:res.data.hits, message:resultNotFoundMsg, loading:false});
        }).catch((error) => {
            if(axios.isCancel(error) || error){
                this.setState({loading: false, message: "Failed to fetch data. Please check the network."});
            }
        });
    };

    renderSearchResults = () => {
        const {results} = this.state;

        if(Object.keys(results).length  && results.length) {
            return (
                <div className="results-container">
                    {
                        results.map(result => {
                                return (
                                    <a key={result.id} href={result.webformatURL} className="result-item">
                                        <div className="image-wrapper">
                                            <img className="image" src={result.webformatURL} alt={result.user} />
                                        </div>
                                        <div className="user">{result.user}</div>
                                    </a>
                                );
                            }
                        )
                    }
                </div>
            );
        }
    };

    render(){
        const {query, loading, message} = this.state;

        return(
            <div className="container">
                {/*Header*/}
                <h2 className="heading">Live Search: React Application</h2>

                {/*Search input*/}
                <label className="search-label" htmlFor="search-input">
                    <input type="text"
                           name="search-input"
                           value={query}
                           id="search-input"
                           placeholder="Search..."
                           onChange={this.handleOnInputChange}
                    />
                    <i className="fa fa-search search-icon" aria-hidden="true" />
                </label>

                {/*Error message*/}
                {message ? <p className="error-message">{message}</p> : ""}

                {/*Loader*/}
                <img src={Loader} className={`search-loading ${loading ? "show" : "hide"}`} alt="Loader" />

                {/*Results*/}
                {this.renderSearchResults()}
            </div>
        );
    }
}

export default Search;
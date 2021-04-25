import React, {Component} from 'react';
import ReactSearchBox from 'react-search-box';
import './App.css';

export default class Search extends Component {
  data = [
    {
      key: 'john',
      value: 'John Doe',
    },
    {
      key: 'jane',
      value: 'Jane Doe',
    },
    {
      key: 'mary',
      value: 'Mary Phillips',
    },
    {
      key: 'robert',
      value: 'Robert',
    },
    {
      key: 'karius',
      value: 'Karius',
    },
  ]

  render () {
    return (
      <React.Fragment>
        <title>Search</title>
        <h2>Search</h2>
        <ReactSearchBox
          placeholder="Placeholder"
          value="Doe"
          data={this.data}
          callback={record => console.log(record)}
        />
      </React.Fragment>
    );
  }
}

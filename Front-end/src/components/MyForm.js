import React from 'react';

class MyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:'',
      fuzziness:''
    };
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { name, fuzziness } = this.state;

    const book = {
      name,
      fuzziness,
    };
    //console.log(book)
    fetch('http://localhost:5000/search', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data)
      // update search result
      if (this.props.onResult) {
        this.props.onResult(data);
        //console.log(this.props.onResult.data)
      }

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  render() {
    //console.log(this.props)
    return (
      <div>
        <br />
        <div className="container" >
          <form onSubmit={this.handleSubmit}>
            <div style={{ width: '30%' }} className="form-group">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Constituency"
                onChange={this.handleInputChange}
              />
            </div>
            <br />
            <div style={{ width: '30%' }} className="form-group">
              <input
                type="text"
                className="form-control"
                name="fuzziness"
                placeholder="fuzziness"
                onChange={this.handleInputChange}
              />
            </div>
            <br />
            <div style={{ width: '30%' }}>
              <button className="btn btn-success" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default MyForm;
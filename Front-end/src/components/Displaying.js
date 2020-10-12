import React from 'react';

class Displaying extends React.Component {
  constructor(props) {
    super(props);
  }
    render() {
        console.log(this.props)
        return (
            <div>
               {this.props.data.map(e =>
                <>
                   <div>{e._source.constituencyname}</div>
                </>
                )}
            </div>
        )
    }
  }


export default Displaying;

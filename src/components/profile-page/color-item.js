import React from 'react';

class ColorItem extends React.Component {
  render () {
    return (
      <div className="color-item" colorid={this.props.colorid}
           color={this.props.color}
           style={{background: this.props.color}}>
      </div>
    )
  }
}

export default ColorItem;

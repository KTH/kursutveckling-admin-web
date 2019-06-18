import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class InfoButton extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    const { id, textObj } = this.props
    return (
      <div>
        <Button id={id} type="button" className='btn-info-modal btn btn-secondary info-inline' onClick={this.toggle}/>
       
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target={id} toggle={this.toggle}>
          <PopoverHeader>{textObj.header}</PopoverHeader>
          <PopoverBody>{textObj.body}</PopoverBody>
        </Popover>
      </div>
    );
  }
}

export default InfoButton
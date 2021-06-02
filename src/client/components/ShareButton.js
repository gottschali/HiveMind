import React, {Component} from "react";

import Button from 'react-bootstrap/Button';

export class ShareButton extends Component {
  constructor(props) {
    super(props);
    this.share = this.share.bind(this);
  }
  async share() {
    if (navigator.canShare) {
        await navigator.share(this.props.data).then( () => {
          console.log("navigator shared data")
        }).catch( (err) =>  {
          alert(err)
        });
    } else {
      alert('Your browser does not support native sharing. Please use the clipboard')
    }
  }
  render() {
    return (
      <Button variant="primary" onClick={this.share}>
        <i className="bi bi-share"></i>
      </Button>
    );
  }
}

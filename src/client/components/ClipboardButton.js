import React, {Component} from "react";

import Button from 'react-bootstrap/Button';

export class ClipboardButton extends Component {
  constructor(props) {
    super(props);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }
  async copyToClipboard() {
        navigator.clipboard.writeText(this.props.url).then( () => {
            alert("copied to the clipboard")
        }).catch( (err) => {
            alert("error")
        });
  }
  render() {
    return (
      <Button variant="secondary" onClick={this.copyToClipboard}>
          <i className="bi bi-clipboard"></i>
      </Button>
    );
  }
}

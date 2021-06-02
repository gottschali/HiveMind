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
        <svg className="bi bi-share" xmlns="http:www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
        </svg>
      </Button>
    );
  }
}

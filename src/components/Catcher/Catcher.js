import React, { Component } from 'react';

export default class Catcher extends Component {
  state = {
    error: false,
  }

  componentDidCatch (error, stack) {
    console.log('ERROR:', error);
    console.log('STACKTRACE:', stack.componentStack);

    this.setState({
      error: true,
    });
  }

  render () {
    if (this.state.error) {
      return (
        <section>Ошибка</section>
      );
    }

    return this.props.children;
  }
}

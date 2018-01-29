import React, { PureComponent } from 'react';
import { Row, Wrapper } from './';

export class FullRow extends PureComponent {
  render() {
    return (
      <Row style={[this.props.rowStyle]} >
        <Wrapper
          style={[
            { flex: 1 },
            this.props.wrapperStyle,
            this.props.paddingHorizontal ? { paddingHorizontal: this.props.paddingHorizontal } : {},
          ]}
        >
          {this.props.children}
        </Wrapper>
      </Row >
    );
  }
}

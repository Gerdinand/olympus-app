import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Row, Wrapper } from './';
import PropTypes from 'prop-types';

export class FullRow extends PureComponent {
  static propTypes = {
    rowStyle: View.propTypes.style,
    wrapperStyle: View.propTypes.style,
    paddingHorizontal: PropTypes.number,
    children: PropTypes.node,
    viewProps: View.propTypes,
  }

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

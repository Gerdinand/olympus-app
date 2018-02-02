import React, { PureComponent } from 'react';
import { ViewPropTypes } from 'react-native';
import { Row, Wrapper } from './';
import PropTypes from 'prop-types';

export class FullRow extends PureComponent {
  static propTypes = {
    rowStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    paddingHorizontal: PropTypes.number,
    children: PropTypes.node,
    viewProps: ViewPropTypes,
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

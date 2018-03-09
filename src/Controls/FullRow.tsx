import React from 'react';
import { ViewProperties } from 'react-native';
import { Row, Wrapper } from './';

interface InternalProps {
  rowStyle?: any, // fix this any types
  wrapperStyle?: any,
  paddingHorizontal?: number,
  viewProps?: ViewProperties,
}
export class FullRow extends React.PureComponent<InternalProps> {

  public render() {
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

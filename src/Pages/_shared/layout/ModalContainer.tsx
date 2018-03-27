import React, { Component } from 'react';
import { Modal, Dimensions, ViewStyle, StyleSheet } from 'react-native';
import { Row, Column } from '.';
import Colors from '../../../Constants/Colors';

interface ModalContainerProps {
  width?: number;
  height?: number;
  visible: boolean;
  style?: ViewStyle;
}

const DEFAULT_WIDTH = Dimensions.get('window').width;
const DEFAULT_HEIGHT = 250;

export class ModalContainer extends Component<ModalContainerProps> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
      >
        <Row
          style={style.background}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Column
            style={[
              style.modal,
              {
                width: this.props.width ? this.props.width : DEFAULT_WIDTH,
                height: this.props.height ? this.props.height : DEFAULT_HEIGHT,
              },
              this.props.style ? this.props.style : {},
            ]}
            justifyContent={'center'}
            alignItems={'center'}
          >
            {this.props.children}
          </Column>
        </Row>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
  },
  modal: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 4,
  },
});
